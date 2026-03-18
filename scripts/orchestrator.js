// orchestrator.js - Autonomous AI Web Publishing Orchestrator for PlanYourPark.com

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const { v4: uuidv4 } = require('uuid');

// Configuration
const STATE_BRANCH = 'state';
const STATE_FILE_PATH = 'state.json';
const REPO_OWNER = 'otto608bot';
const REPO_NAME = 'orlando-park-guide';

// Initialize Octokit with GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// State Machine States
const STATES = {
  IDLE: 'IDLE',
  AWAITING_SEO_CONTENT: 'AWAITING_SEO_CONTENT',
  PR_OPEN: 'PR_OPEN',
  CONTENT_UPDATED: 'CONTENT_UPDATED',
  DEPLOYED: 'DEPLOYED',
  SYNDICATED_AND_MAILED: 'SYNDICATED_AND_MAILED',
};

// Pipeline Definitions
const PIPELINES = {
  PRODUCT_MANAGER: 'product-manager',
  KEYWORD_SCOUT: 'keyword-scout',
  SEO_GENERATOR: 'seo-generator',
  AFFILIATE_INJECTOR: 'affiliate-injector',
  SOCIAL_SYNDICATOR: 'social-syndicator',
  EMAIL_ENGINE: 'email-engine',
  CONTENT_JANITOR: 'content-janitor',
  RANK_TRACKER: 'rank-tracker',
  PROGRAMMATIC_SEO: 'programmatic-seo',
};

class Orchestrator {
  constructor() {
    this.state = STATES.IDLE;
    this.stateData = {};
    this.requestId = null;
  }

  // Load state from the state branch
  async loadState() {
    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: STATE_FILE_PATH,
        ref: STATE_BRANCH,
      });

      const stateContent = Buffer.from(data.content, 'base64').toString('utf8');
      const stateJson = JSON.parse(stateContent);
      this.state = stateJson.state || STATES.IDLE;
      this.stateData = stateJson.stateData || {};
      this.requestId = stateJson.requestId || null;
      console.log(`Loaded state: ${this.state}`);
    } catch (error) {
      console.error('Error loading state:', error);
      // Initialize state if not found
      this.state = STATES.IDLE;
      this.stateData = {};
      this.requestId = null;
      await this.saveState();
    }
  }

  // Save state to the state branch
  async saveState() {
    try {
      const stateJson = JSON.stringify({
        state: this.state,
        stateData: this.stateData,
        requestId: this.requestId,
        timestamp: new Date().toISOString(),
      }, null, 2);

      // Get the current state file SHA (for update)
      let sha;
      try {
        const { data } = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: STATE_FILE_PATH,
          ref: STATE_BRANCH,
        });
        sha = data.sha;
      } catch (error) {
        // File doesn't exist, will create it
      }

      await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: STATE_FILE_PATH,
        message: `Update state to ${this.state} at ${new Date().toISOString()}`,
        content: Buffer.from(stateJson).toString('base64'),
        branch: STATE_BRANCH,
        sha: sha || undefined,
      });
      console.log(`Saved state: ${this.state}`);
    } catch (error) {
      console.error('Error saving state:', error);
      throw error;
    }
  }

  // Process incoming event
  async processEvent(eventType, payload) {
    await this.loadState();
    this.requestId = payload.request_id || uuidv4();

    console.log(`Processing event: ${eventType}, State: ${this.state}`);

    switch (eventType) {
      case 'cron_daily':
        await this.handleCronDaily();
        break;
      case 'keyword_identified':
        await this.handleKeywordIdentified(payload);
        break;
      case 'pr_merged':
        await this.handlePrMerged(payload);
        break;
      case 'content_updated':
        await this.handleContentUpdated(payload);
        break;
      case 'deployment_complete':
        await this.handleDeploymentComplete(payload);
        break;
      case 'monitoring_update':
        await this.handleMonitoringUpdate(payload);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    await this.saveState();
  }

  // Handle daily cron trigger
  async handleCronDaily() {
    if (this.state !== STATES.IDLE) {
      console.log(`Cannot start cron job, not in IDLE state. Current state: ${this.state}`);
      return;
    }

    this.state = STATES.AWAITING_SEO_CONTENT;
    this.stateData = { trigger: 'cron_daily' };
    await this.triggerPipeline(PIPELINES.KEYWORD_SCOUT, { action: 'identify_keywords' });
  }

  // Handle keywords identified by scout
  async handleKeywordIdentified(payload) {
    if (this.state !== STATES.AWAITING_SEO_CONTENT) {
      console.log(`Ignoring keyword_identified, not in AWAITING_SEO_CONTENT state. Current state: ${this.state}`);
      return;
    }

    this.stateData.keywords = payload.keywords;
    this.stateData.trend_score = payload.trend_score;
    this.stateData.target_audience = payload.target_audience;
    await this.triggerPipeline(PIPELINES.SEO_GENERATOR, {
      keywords: payload.keywords,
      trend_score: payload.trend_score,
      target_audience: payload.target_audience,
      request_id: this.requestId,
    });
    this.state = STATES.PR_OPEN;
  }

  // Handle PR merge event
  async handlePrMerged(payload) {
    if (this.state !== STATES.PR_OPEN) {
      console.log(`Ignoring pr_merged, not in PR_OPEN state. Current state: ${this.state}`);
      return;
    }

    this.stateData.commit_sha = payload.commit_sha;
    this.stateData.file_paths = payload.file_paths;
    await this.triggerPipeline(PIPELINES.AFFILIATE_INJECTOR, {
      commit_sha: payload.commit_sha,
      file_paths: payload.file_paths,
      request_id: this.requestId,
    });
    this.state = STATES.CONTENT_UPDATED;
  }

  // Handle content updated event
  async handleContentUpdated(payload) {
    if (this.state !== STATES.CONTENT_UPDATED) {
      console.log(`Ignoring content_updated, not in CONTENT_UPDATED state. Current state: ${this.state}`);
      return;
    }

    // Netlify deploy is automatic on commit to main, move to DEPLOYED
    this.state = STATES.DEPLOYED;
    this.stateData.deployed_files = payload.file_paths;
  }

  // Handle deployment complete event
  async handleDeploymentComplete(payload) {
    if (this.state !== STATES.DEPLOYED) {
      console.log(`Ignoring deployment_complete, not in DEPLOYED state. Current state: ${this.state}`);
      return;
    }

    this.stateData.url = payload.url;
    this.stateData.title = payload.title;
    this.stateData.tags = payload.tags;

    await Promise.all([
      this.triggerPipeline(PIPELINES.SOCIAL_SYNDICATOR, {
        url: payload.url,
        title: payload.title,
        tags: payload.tags,
        request_id: this.requestId,
      }),
      this.triggerPipeline(PIPELINES.EMAIL_ENGINE, {
        url: payload.url,
        title: payload.title,
        request_id: this.requestId,
      }),
    ]);

    this.state = STATES.SYNDICATED_AND_MAILED;
    // Reset after completion
    this.state = STATES.IDLE;
    this.stateData = {};
    this.requestId = null;
  }

  // Handle monitoring updates (janitor, rank tracker, etc.)
  async handleMonitoringUpdate(payload) {
    // This can happen in any state, as monitoring is background
    this.stateData.monitoring_type = payload.type;
    this.stateData.monitoring_reason = payload.reason;
    this.stateData.file_path = payload.file_path;

    await this.triggerPipeline(PIPELINES.CONTENT_JANITOR, {
      type: payload.type,
      file_path: payload.file_path,
      reason: payload.reason,
      request_id: this.requestId,
    });
    // If not already in a flow, move to PR_OPEN to await merge
    if (this.state === STATES.IDLE) {
      this.state = STATES.PR_OPEN;
    }
  }

  // Trigger a pipeline workflow
  async triggerPipeline(pipelineName, payload) {
    try {
      console.log(`Triggering pipeline: ${pipelineName}`);
      await octokit.actions.createWorkflowDispatch({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        workflow_id: `${pipelineName}.yml`,
        ref: 'main',
        inputs: {
          payload: JSON.stringify(payload),
        },
      });
      console.log(`Successfully triggered ${pipelineName}`);
    } catch (error) {
      console.error(`Error triggering pipeline ${pipelineName}:`, error);
      await this.reportError(`Failed to trigger pipeline ${pipelineName}`, error);
    }
  }

  // Report errors to GitHub Issues
  async reportError(title, error) {
    try {
      await octokit.issues.create({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        title: `[Orchestrator Error] ${title} - Request ID: ${this.requestId}`,
        body: `An error occurred in the orchestrator:

**State:** ${this.state}
**Request ID:** ${this.requestId}
**Error Message:** ${error.message}

**Stack Trace:**
">${error.stack || 'No stack trace available'}

Please investigate.

cc @bennettrothenberg`,
        labels: ['bug', 'orchestrator-error'],
        assignees: ['bennettrothenberg'],
      });
      console.log('Error reported to GitHub Issues');
    } catch (issueError) {
      console.error('Failed to create GitHub Issue for error:', issueError);
    }
  }
}

// Main entry point for GitHub Actions
async function main() {
  const orchestrator = new Orchestrator();
  const eventType = process.env.EVENT_TYPE || 'cron_daily';
  const payload = process.env.EVENT_PAYLOAD ? JSON.parse(process.env.EVENT_PAYLOAD) : {};

  console.log(`Starting orchestrator with event: ${eventType}`);
  await orchestrator.processEvent(eventType, payload);
  console.log('Orchestrator execution complete');
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error in orchestrator:', error);
    process.exit(1);
  });
}

module.exports = Orchestrator;
