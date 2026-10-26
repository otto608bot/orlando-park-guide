# Hub draft changes (2026-10-26)

Run order: `build_patches.py` → `apply.py`, then `names_fix_2026-10-26.py` (CEO review). The names fix supersedes the character lists in build_patches.py.

## Location fields vs published
- **Park changed:** Cape May Cafe (EPCOT → Disney's Beach Club Resort). The other resort restaurants (1900 Park Fare, Chef Mickey's, 'Ohana, Topolino's, Story Book Dining) moved from a generic park label to their resort name for display.
- **Akershus:** park was always EPCOT and is unchanged. Only the secondary `resort` field changed (published "Disney's Beach Club Resort" → "EPCOT"). Display location did not change.

## Character names (only names Disney's official page lists, fetched 2026-10-26)
- Garden Grill: Mickey Mouse, Chip, Dale, "and more" → Chip, Dale, Mickey Mouse
- Tusker House: Donald Duck, Mickey Mouse, "and other friends" → Donald Duck, Mickey Mouse (Goofy not named by Disney)
- Chef Mickey's: Mickey Mouse, "and pals" → Mickey Mouse
- 'Ohana: Lilo, Stitch, "and other friends" → Lilo, Stitch
- Crystal Palace: Winnie the Pooh, "Hundred-Acre Wood pals" → Winnie the Pooh
- Hollywood & Vine: Minnie Mouse, "and friends (seasonal outfits)" → Minnie Mouse
- Cape May Cafe: Minnie Mouse, "and friends" → Minnie Mouse
- No change: 1900 Park Fare, Topolino's, Story Book Dining, Akershus ("Disney Princesses", none named), Cinderella's Royal Table (Cinderella + "Disney Princesses", none named), Be Our Guest (hidden)
