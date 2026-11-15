// Entry numbers are one-based. Keep walkthroughs separate from the puzzle text
// so revealing an answer never changes its evidence, answer, or saved progress.
export const solutionSteps = {
  1: [
    "Read the displayed sentence: “What is the first word of this question?”",
    "The sentence asks about its own first word, so start at the left edge.",
    "That first word is “What”. The answer is what.",
  ],
  2: [
    "“Read their beginnings” tells you to use the start of each line.",
    "Take the first letters of Some, Take, Answers, and Read: S, T, A, R.",
    "Read those letters from top to bottom to get star. This is an acrostic.",
  ],
  3: [
    "Subtract each number from the next: 3 − 2 = 1, 5 − 3 = 2, 8 − 5 = 3, and 12 − 8 = 4.",
    "The gaps increase by one each time, so the next gap is 5.",
    "Add that gap to the last number: 12 + 5 = 17.",
  ],
  4: [
    "Look for letters whose case stands out inside the words.",
    "Read only the uppercase letters from left to right: M in sMall, A in detAil, K in maKe, and E in thE.",
    "Join M, A, K, E to get make.",
  ],
  5: [
    "Count the letters: notebook has 8, a has 1, paper has 5, and ink has 3.",
    "Sort by those lengths: a, ink, paper, notebook.",
    "The question asks for the second word in that order, which is ink.",
  ],
  6: [
    "Keep the printed letters in place: S _ L _ N C _.",
    "The prompt points to an absence. The word for an absence of sound is SILENCE.",
    "Fill the gaps with I, E, E to make silence.",
  ],
  7: [
    "“Try the other” tells you to reverse the usual reading direction.",
    "Read WODNIW from right to left: W, I, N, D, O, W.",
    "Those letters spell window.",
  ],
  8: [
    "Recognize the numbers as squares: 4 = 2², 9 = 3², 16 = 4², 25 = 5², and 36 = 6².",
    "Increase the base from 6 to 7 for the next square.",
    "7 × 7 = 49, so the answer is 49.",
  ],
  9: [
    "The dots and dashes are Morse code, with one group per letter.",
    "Three dots (...) mean S, and three dashes (---) mean O.",
    "The three groups read S, O, S, giving sos.",
  ],
  10: [
    "Count the words: a / small / place / to / start. There are five.",
    "Count the gaps between neighboring words. There is one fewer gap than words.",
    "5 − 1 = 4, so there are 4 spaces.",
  ],
  11: [
    "Convert the letters to alphabet positions: A = 1, C = 3, E = 5, G = 7.",
    "Each step adds 2, so the next position is 9.",
    "The ninth letter is I, so the answer is i.",
  ],
  12: [
    "Read the question literally: it asks which word is spelled “incorrectly”.",
    "Find the word made of the letters i-n-c-o-r-r-e-c-t-l-y in the sentence.",
    "That word is incorrectly, so incorrectly is the answer.",
  ],
  13: [
    "Apply the given pattern to the four words: first letter, last letter, first letter, last letter.",
    "night gives N, echo gives O, tide gives T, and blue gives E.",
    "Join N, O, T, E to get note.",
  ],
  14: [
    "The seven positions suggest the days of a week, starting with Monday.",
    "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday give M, T, W, T, F, S.",
    "Sunday completes the list, so its initial s is the answer.",
  ],
  15: [
    "Read the three written words in order: BLUE, RED, GREEN.",
    "The instruction asks for the middle word, so select the second one.",
    "Its letters say RED. The answer is red regardless of the ink color.",
  ],
  16: [
    "The prompt asks for the final letter of each line.",
    "The last words are path, blue, bell, lamp. Their last letters are h, e, l, p.",
    "Read them from top to bottom to get help.",
  ],
  17: [
    "Count each star once, keeping the three groups separate at first.",
    "The groups contain 2, 4, and 3 stars.",
    "Add 2 + 4 + 3 = 9, so the answer is 9.",
  ],
  18: [
    "Split TRAIN into T followed by RAIN.",
    "Remove the exact ending RAIN as instructed.",
    "Only T remains, so the answer is t.",
  ],
  19: [
    "The note asks you to write OPEN backwards.",
    "Start at its last letter and read toward the first: N, E, P, O.",
    "Join the reversed letters to get nepo.",
  ],
  20: [
    "The prompt refers to beginnings, so take the first letter of each word.",
    "Passage, Arch, Gate, Entry give P, A, G, E in order.",
    "Join the initials to get page.",
  ],
  21: [
    "Each coded letter is one place ahead of the original, so move backwards by one.",
    "E becomes D, both Ps become O, and S becomes R.",
    "The decoded letters spell door.",
  ],
  22: [
    "Use the given alphabet numbering: A = 1 through Z = 26.",
    "Replace 16 with P, 1 with A, 20 with T, and 8 with H.",
    "Read the letters in the same order to get path.",
  ],
  23: [
    "Treat each eight-bit group as one binary ASCII byte.",
    "Convert the groups to decimal: 01001011 = 75, 01000101 = 69, 01011001 = 89.",
    "ASCII 75, 69, 89 are K, E, Y, giving key.",
  ],
  24: [
    "Each two-character group is a hexadecimal ASCII byte.",
    "Convert 4E, 4F, 54, 45 to decimal: 78, 79, 84, 69.",
    "Look up those ASCII values: N, O, T, E. The answer is note.",
  ],
  25: [
    "The prompt identifies b3Blbg== as Base64. The equals signs are padding.",
    "Open Decoder desk, choose Base64 → text, and translate b3Blbg==.",
    "The decoded text is open, so open is the answer.",
  ],
  26: [
    "Carry out the operations in the stated order, beginning with reversal.",
    "Reversing F U B H gives H B U F.",
    "Move each result back one alphabet place: H→G, B→A, U→T, F→E.",
    "Join the letters to get gate.",
  ],
  27: [
    "Separate the Morse message into its four letter groups, using the gaps.",
    "Decode each group: -.. is D, --- is O, and .-. is R.",
    "The four groups spell D, O, O, R, so the answer is door.",
  ],
  28: [
    "The numbers are decimal ASCII codes, so keep them in base ten.",
    "Translate each code: 83→S, 72→H, 69→E, 76→L, 70→F.",
    "Join those letters to get shelf.",
  ],
  29: [
    "A half-turn of a 26-letter alphabet is a shift of 13, called ROT13.",
    "Apply it to FRPERG: F→S, R→E, P→C, E→R, R→E, G→T.",
    "The decoded word is secret.",
  ],
  30: [
    "Pair the normal alphabet with its reverse: A↔Z, B↔Y, C↔X, and so on. This is Atbash.",
    "Replace N, V, H, H, Z, T, V with M, E, S, S, A, G, E.",
    "Read the replacements to get message.",
  ],
  31: [
    "In XIV, IV is 5 − 1 = 4, so XIV is 10 + 4 = 14.",
    "VI is 5 + 1 = 6.",
    "Add the two values: 14 + 6 = 20.",
  ],
  32: [
    "Check the rule by adding the previous two terms: 2 + 3 = 5, 3 + 5 = 8, and 5 + 8 = 13.",
    "For the next term, use the last two numbers, 8 and 13.",
    "8 + 13 = 21, so the answer is 21.",
  ],
  33: [
    "Number the displayed characters from 1, as the prompt specifies.",
    "Keep positions 1, 3, 5, 7: c, l, u, e. The Xs occupy the positions you skip.",
    "Join the kept letters to get clue.",
  ],
  34: [
    "Use the pictured QWERTY keyboard to find each coded key.",
    "Take the key immediately to its left: E→W, P→O, T→R, F→D.",
    "Those neighboring keys spell word.",
  ],
  35: [
    "Read the sequence as consecutive alphabet letters: Y, Z, A.",
    "After Z, the sequence wraps around to A and keeps moving forwards.",
    "The letter after A is B, so the answer is b.",
  ],
  36: [
    "Each word is a NATO phonetic name for a letter.",
    "Lima represents L, Oscar O, Charlie C, and Kilo K.",
    "Join the represented letters to get lock.",
  ],
  37: [
    "Each percent sign introduces a hexadecimal byte in URL encoding.",
    "Decode the bytes: 6d→m, 61→a, 72→r, 67→g, 69→i, 6e→n.",
    "The decoded URL text is margin.",
  ],
  38: [
    "For each pair, use the first digit as the row and the second as the column. Both start at 1.",
    "In the displayed square, 13 selects C, 31 selects L, 45 selects U, and 15 selects E.",
    "Join the selected cells to get clue.",
  ],
  39: [
    "Convert the five-bit binary groups to numbers: 00001 = 1, 00100 = 4, 00000 = 0, 00011 = 3.",
    "Use the specified zero-based alphabet: 0→A, 1→B, 3→D, 4→E.",
    "The values 1, 4, 0, 3 therefore spell bead.",
  ],
  40: [
    "First decode the hexadecimal ASCII bytes: 52→R, 4F→O, 4F→O, 44→D.",
    "The intermediate word is ROOD. The prompt then tells you to reverse it.",
    "ROOD backwards is door.",
  ],
  41: [
    "Hover over the small mark, tap it, or select it in Inspect this page → Elements.",
    "Read its title attribute: “The word you need is lantern.” Its accessible name repeats that message.",
    "The tooltip directly identifies lantern as the answer.",
  ],
  42: [
    "Open Inspect this page → Page source and find the quiet note near the puzzle text.",
    "Read the HTML comment: <!-- The word is velvet. -->. Comments are present in source even when the page does not display them.",
    "The comment gives the answer velvet.",
  ],
  43: [
    "Open Inspect this page → Page details and read the compass image’s accessible description.",
    "Its aria-label says: “A brass compass with NORTH engraved beside its needle.”",
    "The engraved word named in that description is north.",
  ],
  44: [
    "Read the current address in your browser, the offline entry address, or Inspect this page → Page details.",
    "Find the fragment after #: second-thought.",
    "The fragment supplies the words second thought. Hyphens and spaces are treated alike in answers.",
  ],
  45: [
    "The apparently empty area contains text whose color blends into the paper.",
    "Select that text or press Lift the paper to reveal the letters sparrow.",
    "The hidden word is sparrow; the concealment only changed its appearance.",
  ],
  46: [
    "Open Inspect this page → Elements and find the ticket that says ADMIT ONE.",
    "Read its data-key attribute, which has the value moss.",
    "The question asks for that stored key, so the answer is moss.",
  ],
  47: [
    "All three shown rules target the paragraph: its class is note and its ID is note.",
    "An ID selector (#note) has higher specificity than a class selector (.note), so it wins before source order is considered.",
    "The winning rule sets color: red, so the answer is red.",
  ],
  48: [
    "Open Inspect this page → Page details and find the entry’s extra style rule.",
    "Read .before-ticket::before { content: “POCKET”; }. The ::before pseudo-element inserts this content before the ticket.",
    "The inserted word is pocket.",
  ],
  49: [
    "The form &#number; denotes a decimal HTML character reference.",
    "Decode the numbers: 107 is k, 101 is e, and 121 is y.",
    "Join the decoded characters to get key.",
  ],
  50: [
    "Open Inspect this page → Page source and find the folded-bird image.",
    "Read the filename in src: paper-crane.svg. The offline edition preserves the same name in data-filename.",
    "The bird named in that filename is a crane, so the answer is crane.",
  ],
  51: [
    "Look at the browser tab title, or open Inspect this page → Page details to read the document title.",
    "The title begins HARBOR before the usual game and entry information.",
    "The question asks for that first word, so the answer is harbor.",
  ],
  52: [
    "Open Inspect this page → Elements and select the note that says “a variable thought”.",
    "Read its inline style: --whisper: silver. Names beginning with -- are CSS custom properties.",
    "The value stored in --whisper is silver.",
  ],
  53: [
    'Inspect the tree-rows container and read data-row="2".',
    "Count the displayed rows from 1: ASH is row 1, ELM row 2, OAK row 3.",
    "The chosen row is the second one, so the answer is elm.",
  ],
  54: [
    "Open Inspect this page → Page details and find the lighthouse image’s accessible name.",
    "Its aria-label reads: “A lighthouse blinking the word beacon.”",
    "That description identifies beacon as the word being signaled.",
  ],
  55: [
    "Click or tap the “For the curious” summary to expand the note.",
    "The revealed sentence says the small bird is a wren.",
    "The question asks for that bird, so the answer is wren.",
  ],
  56: [
    "Open Inspect this page → Page source and look beside the empty display case.",
    'Find the span with the hidden attribute and data-material="metal". Its text is copper.',
    "hidden removes the element from view but leaves its text in the document, so the answer is copper.",
  ],
  57: [
    "Find the comment in Inspect this page → Page source: hexadecimal ASCII: 6f 70 65 6e.",
    "Decode each hex byte as a character: 6f→o, 70→p, 65→e, 6e→n.",
    "Join those characters to get open.",
  ],
  58: [
    "Read the current address in the browser, the offline entry address, or Inspect this page → Page details.",
    "Find the named query parameter after the question mark: key=thimble.",
    "A parameter’s value follows its equals sign, so the answer is thimble.",
  ],
  59: [
    'Inspect the fragments container and read data-order="3,1,2".',
    "Use that order to select fragment 3 (AR), then 1 (CHI), then 2 (VE).",
    "Join AR + CHI + VE to get archive.",
  ],
  60: [
    "Open Inspect this page → Page source and read the comment: move back 1.",
    "Shift the visible letters backwards by one: Q→P, B→A, T→S, T→S, B→A, H→G, F→E.",
    "The result spells passage.",
  ],
  61: [
    "Number the array’s entries from index 0. The letters C, O, D, E are at indices 0, 2, 4, 6.",
    "The test i % 2 === 0 keeps those even indices and removes the x entries.",
    'join("") combines the kept letters without spaces, returning code.',
  ],
  62: [
    "Use each record’s rank rather than its current position in the array.",
    "Sorting ranks from 1 to 5 gives T, R, A, C, E.",
    "Join the ch values in that sorted order to get trace.",
  ],
  63: [
    "Read the records in their existing order and check their active flags.",
    "Keep D, U, S, K because their flags are true. Remove X and Q because their flags are false.",
    "Join the kept letters without sorting to get dusk.",
  ],
  64: [
    "Index starlight from zero: s:0, t:1, a:2, r:3, l:4, i:5, g:6, h:7, t:8.",
    "slice(4, 9) includes index 4 and stops before 9, so it keeps indices 4 through 8.",
    "Those characters are l, i, g, h, t, giving light.",
  ],
  65: [
    "Add the elapsed hours to the starting hour: 10 + 7 = 17.",
    "Wrap around the 12-hour clock by subtracting 12 once.",
    "17 − 12 = 5, so the clock shows 5.",
  ],
  66: [
    "Ordinary arithmetic gives multiplication priority over addition.",
    "Calculate 3 × 4 = 12 first.",
    "Then add 2 + 12 = 14.",
  ],
  67: [
    'split("") separates levart into l, e, v, a, r, t.',
    "reverse() changes that order to t, r, a, v, e, l.",
    'join("") puts those characters back together, producing travel.',
  ],
  68: [
    "The pattern [0-9] matches a digit, and the g flag applies it to every matching digit.",
    "Replacing each match with an empty string removes 4, 1, 9, 2, 8 from s4i1g9n2a8l.",
    "The remaining letters form signal.",
  ],
  69: [
    "reduce starts with the supplied accumulator value of 0.",
    "Add each entry: 0 + 2 = 2, then +4 = 6, then +6 = 12, then +8 = 20.",
    "The final accumulator is 20.",
  ],
  70: [
    "Index margin from zero: m:0, a:1, r:2, g:3, i:4, n:5.",
    "The condition i > 2 keeps indices 3, 4, 5, so it keeps g, i, n.",
    "Joining those letters gives gin.",
  ],
  71: [
    "Start in the upper-left corner and read the top row: C, L, O.",
    "Continue clockwise down the right edge (C, K), along the bottom toward the left (W, I), and up the left edge (S). Do not count a corner twice.",
    "Read the remaining center cell E last. The complete path spells clockwise.",
  ],
  72: [
    "Test AMBER: statement A is true, B is false, and C is false. That gives exactly one true statement.",
    "Test BLUE: A is false, B is true, and C is true. That gives two true statements.",
    "Only the first choice satisfies the condition, so the answer is amber.",
  ],
  73: [
    "Compare the two bit strings column by column. XOR gives 1 for different bits and 0 for equal bits.",
    "The columns give 0 XOR 0 = 0, 1 XOR 0 = 1, 0 XOR 1 = 1, and 1 XOR 1 = 0.",
    "Keep all four positions, including the leading zero: the answer is 0110.",
  ],
  74: [
    "Use all six letters of LISTEN exactly once.",
    "The phrase “makes no sound” points to the word SILENT, which has the same letters.",
    "Rearrange them as S, I, L, E, N, T to get silent.",
  ],
  75: [
    "Number letters from A = 0 to Z = 25, and repeat KEY to match four code letters: K, E, Y, K.",
    "Subtract key from code: Y(24) − K(10) = O(14), and T(19) − E(4) = P(15).",
    "Continue: C(2) − Y(24) = −22, which wraps to E(4); X(23) − K(10) = N(13).",
    "Read O, P, E, N to get open.",
  ],
  76: [
    "Separate the odd-position letters SCE from the even-position letters ERT.",
    "Alternate between the halves, starting on the left: S, E, C, R, E, T.",
    "The interleaved word is secret.",
  ],
  77: [
    "The answer must use C, E, H, O once each.",
    "A sound that replies in an empty space is an ECHO.",
    "Those letters can be rearranged as E, C, H, O, so the answer is echo.",
  ],
  78: [
    "The quotes around “10” make it a JavaScript string.",
    "When + has a string operand here, it appends the other operand as text. The number 2 becomes the character 2.",
    "Appending 2 to 10 produces the string 102.",
  ],
  79: [
    "A ternary expression has the form condition ? valueIfTrue : valueIfFalse.",
    "locked is false, so choose the value after the colon.",
    "That value is enter, so the answer is enter.",
  ],
  80: [
    "Filter first: remove the X record because active is false.",
    "Sort the remaining records by n from 1 to 5: N, I, G, H, T.",
    "Join their ch values to get night.",
  ],
  81: [
    "Decode each hexadecimal ASCII byte: 65→e, 74→t, 61→a, 67→g.",
    "The intermediate text is etag. Apply the second instruction and reverse it.",
    "Reading etag backwards gives gate.",
  ],
  82: [
    "Take the first letters of the six lines: T, J, M, W, F, S.",
    "Move each one back an alphabet place: T→S, J→I, M→L, W→V, F→E, S→R.",
    "The resulting initials spell silver.",
  ],
  83: [
    "Convert the four binary ASCII bytes to decimal: 66, 67, 82, 65.",
    "Those ASCII values spell BCRA. This is the intermediate text, before the half-turn.",
    "Apply ROT13: B→O, C→P, R→E, A→N, producing open.",
  ],
  84: [
    "Decode the Base64 text dHNhZQ==, using Decoder desk if needed.",
    "The decoded text is tsae. Now reverse its letter order.",
    "tsae backwards is east.",
  ],
  85: [
    "Remove the four compass directions: north, east, south, west.",
    "Keep the other words in order: apple, river, crane, harbor.",
    "Their first letters A, R, C, H spell arch.",
  ],
  86: [
    "Recognize the values as cubes: 1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64.",
    "Use the next base, 5, and multiply it by itself three times.",
    "5 × 5 × 5 = 125, so the answer is 125.",
  ],
  87: [
    "Sort the words alphabetically. door comes first, and river comes last.",
    "Compare the two O words beyond their first letter: oak comes before orbit. The complete order is door, oak, orbit, river.",
    "Take the first letter of each sorted word: D, O, O, R, giving door.",
  ],
  88: [
    "Each pair selects a line and then a word, counting both from 1.",
    "1:5 selects secret, 2:3 selects appear, 3:3 selects forgotten, and 4:2 selects echo.",
    "Take the first letters of the selected words: S, A, F, E, giving safe.",
  ],
  89: [
    "The selector #notes > .keep requires a .keep element immediately inside #notes.",
    "I, N, K satisfy that relationship. X is inside another div, so it is a descendant but not a direct child of #notes.",
    "Read the matched text in document order to get ink.",
  ],
  90: [
    "The top row L, G, T supplies positions 1, 3, 5. The lower row I, H supplies positions 2, 4.",
    "Alternate top, bottom, top, bottom, top: L, I, G, H, T.",
    "The woven letters spell light.",
  ],
  91: [
    "Use the assignments on the first line rather than ordinary alphabet positions.",
    "Replace 3, 2, 1, 4 with their assigned letters: L, I, F, E.",
    "Read them in that order to get life.",
  ],
  92: [
    "Add each row’s digits: 4 + 7 + 2 = 13; 3 + 1 + 6 = 10; 5 + 8 + 5 = 18.",
    "Only the row beginning 316 has the required sum of 10.",
    "The word beside 316 is hush, so the answer is hush.",
  ],
  93: [
    "Look for one ending that makes a familiar compound with all three beginnings.",
    "Adding LIGHT gives moonlight, sunlight, and starlight.",
    "Since the same ending works in each case, the answer is light.",
  ],
  94: [
    "Combine the first two relationships: W is left of E, and E is left of S, giving W, E, S.",
    "S is left of T, so place T after that chain.",
    "Reading the row from left to right gives west.",
  ],
  95: [
    "Open Inspect this page → Page source and read the instruction in the comment: move back 2 places.",
    "Shift the visible RCRGT backwards by two: R→P, C→A, R→P, G→E, T→R.",
    "The decoded word is paper.",
  ],
  96: [
    "Keep only records with keep: true. This removes X.",
    "Sort the remaining records by pos ascending: 1→P, 2→E, 3→A, 4→R, 5→L.",
    "Join their letters without another transformation to get pearl.",
  ],
  97: [
    "Decode the decimal ASCII codes: 71→G, 74→J, 79→O, 66→B, 77→M.",
    "The intermediate word is GJOBM. Move each letter back by one alphabet position.",
    "G→F, J→I, O→N, B→A, M→L, so the answer is final.",
  ],
  98: [
    "Decode the Base64 text RVJHSEVB to get ERGHEA.",
    "Apply ROT13 to the result: E→R, R→E, G→T, H→U, E→R, A→N.",
    "The two decoding steps produce return.",
  ],
  99: [
    "Look up entries 067, 051, 098, 077, 085, 021 in Your index, keeping that order.",
    "Their answers are TRAVEL, HARBOR, RETURN, ECHO, ARCH, DOOR.",
    "Take one first letter from each answer: T, H, R, E, A, D. They spell thread.",
  ],
  100: [
    "The prompt asks you to return the very first answer you gave, so revisit entry 001 in Your index.",
    "Its question was “What is the first word of this question?” The first word was What.",
    "Repeat that original answer: what.",
  ],
  101: [
    "Open Inspect this page → Page source and search for arrival in the document head.",
    'Find <meta name="arrival" content="threshold">. The name identifies the record and content stores its value.',
    "The value filed under arrival is threshold, so the answer is threshold.",
  ],
  102: [
    "Open Inspect this page → Page source and find the site-footer element at the bottom of the document.",
    "Read its comment: “For the returning reader: bramble.” HTML comments are part of the document but are not printed in the layout.",
    "The unprinted note names bramble.",
  ],
  103: [
    "Open Inspect this page → Elements and select the home wordmark in the page header.",
    "Read the link’s data-destination attribute: its value is harvest.",
    "That stored destination is the answer harvest; you do not need to follow the link.",
  ],
  104: [
    "Open Inspect this page → Elements and select the Field notes container, whose class is notebook.",
    "Read its aria-description: “The writing place remembers cypress.” This description is separate from the visible label.",
    "The tree named in the description is cypress.",
  ],
  105: [
    "Open Inspect this page → Elements and select the outermost html element.",
    'Read lang="en-x-orchid". en identifies English; -x- begins a private-use part of a language tag.',
    "The private word after -x- is orchid, so the answer is orchid.",
  ],
  106: [
    "Inspect the large “Look a little closer” page heading, identified by intro-title.",
    "Read its data-echo attribute. It stores hollow even though the displayed heading uses different words.",
    "The heading’s quiet echo is hollow.",
  ],
  107: [
    "Search Page source for unprinted-receipt in the footer.",
    'The input has type="hidden" and value="saffron". A hidden input retains a value while taking no space in the layout.',
    "Read the stored value to get saffron.",
  ],
  108: [
    'In Page source, find the link element in the head with rel="alternate".',
    "Its href is #tangent. The part after # is a fragment identifier.",
    "Take that fragment without its marker: tangent.",
  ],
  109: [
    "Search Elements for the envelope template in the footer and select its content.",
    'The inner span has data-seal="parcel". A template keeps this markup without displaying it as ordinary page content.',
    "The seal value gives the answer parcel.",
  ],
  110: [
    "Find the field-sidebar element in Page source. It contains the notes and pocket tools.",
    "Read the comment inside it: “observer: kestrel”. Comments can carry words without adding visible marks.",
    "The named observer is kestrel.",
  ],
  111: [
    "Open Page source and search the head for edition-date.",
    "Find the meta element whose name is edition-date and read its content value, winter.",
    "That record stores a season rather than a date, so the answer is winter.",
  ],
  112: [
    "Select the site-header element in Inspect this page → Elements or by clicking the top bar in Layout.",
    "Read its data-boundary attribute, whose value is shore.",
    "The question asks for that named boundary, so the answer is shore.",
  ],
  113: [
    "Inspect the site-footer element and read its accessibility attributes.",
    "Its aria-description says “A small glimmer at the end of the page.”",
    "The word describing the light is glimmer.",
  ],
  114: [
    "Search Page source for uninvited-heading in the footer.",
    "Inside that hidden container is an h2 with the text elsewhere. The hidden ancestor keeps the heading out of the layout.",
    "Read the heading’s text to get elsewhere.",
  ],
  115: [
    "Select the pocket-tools section in Elements.",
    "Read its data-receipt attribute, which contains cobalt.",
    "The tool shelf’s stored receipt supplies cobalt as the answer.",
  ],
  116: [
    "Search Page source for margin-note-16 in the footer.",
    "The hidden aside contains a paragraph whose text is ribbon. Its numbered ID identifies the note, while the paragraph supplies the word.",
    "The note’s contents give the answer ribbon.",
  ],
  117: [
    "Open Page source and look in the document head for document-label.",
    'The meta element has name="document-label" and content="vellum".',
    "Read that metadata value to get vellum.",
  ],
  118: [
    "Select the body element in Inspect this page → Elements.",
    "Read its data-texture attribute. Its value is linen.",
    "The texture stored on the body is linen.",
  ],
  119: [
    "Find the first-fold template in the footer using Page source or Elements.",
    "Follow its content into the nested second-fold template, then into the b element.",
    "The innermost text is nest, so the answer is nest.",
  ],
  120: [
    "Go to the document head in Page source rather than the central puzzle rectangle.",
    "Read the comment: “Section VI complete. The next direction is outside.”",
    "The opening note gives the direction outside.",
  ],
  121: [
    "Open Page details to read the current entry’s CSS, or select site-header in Elements to see its computed custom properties.",
    'Find --murmur: "willow". The double hyphen identifies a CSS custom property.',
    "Its stored word is willow; the quotation marks are not part of the answer.",
  ],
  122: [
    "Find the .site-footer::after rule in the current entry’s CSS in Page details.",
    'Its content is "amber", but display: none keeps that generated content out of the picture.',
    "Read the content value to get amber.",
  ],
  123: [
    "Inspect the footer sample. The span has class tone and ID winning-tone.",
    "The green and orange rules use .tone, while the purple rule uses #winning-tone. The ID selector has higher specificity than either class selector.",
    "The ID rule wins and sets purple, so the answer is purple.",
  ],
  124: [
    "Inspect the stubborn-note sample and compare its two color declarations.",
    "The crimson ID rule is ordinary, while the teal class rule includes !important. In these competing author rules, the important declaration wins.",
    "The resulting color is teal.",
  ],
  125: [
    "Select seed-ink in Elements, then examine its parent with class parent-ink.",
    "The parent sets color: indigo. The seed has no color declaration of its own, and text color is inherited.",
    "The seed therefore inherits indigo.",
  ],
  126: [
    'Find the header’s ::before rule in the entry CSS: content: var(--unassigned-signal, "fern").',
    "The first argument names a custom property that is not defined. The second argument supplies the fallback value.",
    "With the property missing, the fallback word fern is used.",
  ],
  127: [
    "Inspect the header CSS and find --first-thread: var(--second-thread).",
    'Follow that reference to --second-thread, whose value is "lilac".',
    "Resolving the variable reference gives lilac.",
  ],
  128: [
    "Inspect the footer’s before-word sample and find its ::before rule.",
    'The rule sets content: "chime ". A ::before pseudo-element generates this text before the sample without making it a child text node.',
    "The generated word, ignoring its trailing space, is chime.",
  ],
  129: [
    'Inspect the footer sample with class attribute-word and read data-label="marigold".',
    "Its ::before rule uses content: attr(data-label), which takes the text from that attribute.",
    "The attribute supplies the word marigold.",
  ],
  130: [
    "Find the footer’s ::before content in Page details. It contains CSS escapes: \\6d \\6f \\73 \\73.",
    "Treat the escape numbers as hexadecimal character values: 6d→m, 6f→o, 73→s, 73→s. Spaces terminate the escapes here.",
    "The escaped content spells moss.",
  ],
  131: [
    "Inspect flex-message in the footer and read the order values on its four children.",
    "In increasing CSS order, f1 contains P, f2 A, f3 T, and f4 H. Layout displays them in that order.",
    "Read the visual order to get path.",
  ],
  132: [
    "Inspect grid-message and the grid-column rules on its children.",
    "All pieces are placed in row 1: column 1 is L, column 2 A, column 3 M, column 4 P.",
    "Read that displayed row from left to right to get lamp.",
  ],
  133: [
    "Select measured-width in Elements and read its CSS width: calc(30px + 12px).",
    "Add the two pixel lengths: 30 + 12 = 42. Padding and borders are zero, so they add nothing.",
    "The width is 42 pixels; enter 42 without the unit.",
  ],
  134: [
    "The box uses content-box, so its declared 40px width covers only the content.",
    "Add left and right padding: 5 + 5 = 10px. Add both borders: 2 + 2 = 4px.",
    "The total border-to-border width is 40 + 10 + 4 = 54px, so the answer is 54.",
  ],
  135: [
    "Find display-records in Elements and compare its two spans.",
    "The .undisplayed span matches display: none, which removes its box from the layout. Its data-name is sable.",
    "The question asks for the removed element’s name, so the answer is sable.",
  ],
  136: [
    "Find visibility-records in Elements and select the span with class unseen.",
    'Its visibility: hidden rule makes it invisible while preserving its space. The same span has data-name="mist".',
    "Read that name to get mist.",
  ],
  137: [
    "Inspect quarter-compass and read transform: rotate(90deg).",
    "One full turn is 360 degrees, so one quarter-turn is 360 ÷ 4 = 90 degrees.",
    "The 90-degree rotation is exactly 1 quarter-turn, so enter 1.",
  ],
  138: [
    "Select gap-sample in Elements and examine the container’s layout styles.",
    "The flex container has gap: 17px. This property sets the space between neighboring boxes.",
    "The question asks for the gap value rather than the sum of the gaps, so enter 17.",
  ],
  139: [
    "Open Page details and find the @keyframes declaration in the entry CSS.",
    "The identifier immediately after @keyframes is drift. The from and to blocks define its frames.",
    "The requested animation name is drift, even though no element uses it.",
  ],
  140: [
    'Read the body’s custom property in the entry CSS: --understory-key: "understory".',
    "The footer sets --inherited-key: var(--understory-key). Custom properties inherit, so it can resolve the value defined on body.",
    "Following the inherited reference gives understory.",
  ],
  141: [
    "Find direct-notes in the footer’s source. The > in #direct-notes > .keep means a direct child.",
    "The direct .keep spans hold I, N, K. The X span is nested inside a div, so it does not match.",
    "Join the matching text in document order to get ink.",
  ],
  142: [
    "Find even-ledger in the footer and count its element children starting at 1.",
    "Children 2, 4, 6, 8 are the even positions. Their text is G, A, T, E; the odd positions contain x.",
    "Join the even-position letters to get gate.",
  ],
  143: [
    'Find sibling-ledger, then locate the span with data-mark="start".',
    "Move to the next element sibling, skipping the intervening comment because a comment is not an element.",
    "The next span contains birch, so the answer is birch.",
  ],
  144: [
    'Find previous-ledger and its b element with data-mark="end".',
    "Look at the element immediately before that marker, which is the span containing reed.",
    "The preceding word is reed.",
  ],
  145: [
    "Find edge-branch in the footer’s source and identify its first and last element children.",
    "The first child says sun and the last says rise. Leave the two middle children out.",
    "Join sun + rise to get sunrise.",
  ],
  146: [
    'Inspect the notebook and read aria-describedby="notebook-description-key".',
    'That value is an element ID. Find the element with id="notebook-description-key" in the footer; its text is thistle.',
    "The referenced description supplies the answer thistle.",
  ],
  147: [
    "Inspect the footer’s aria-labelledby value: name-first name-last.",
    "Follow the two IDs in the listed order. name-first contains day, and name-last contains break.",
    "The puzzle asks you to join the pieces: day + break gives daybreak.",
  ],
  148: [
    "Search Page source for comment-ledger in the footer.",
    "Between the before and after spans is <!-- fallow -->. It is a comment node rather than an element.",
    "The word inside the comment is fallow.",
  ],
  149: [
    'Find numbered-ledger and read its ordered list. start="7" changes the displayed numbering.',
    "Count actual li elements from the beginning: dew is first, rain second, haze third, fog fourth.",
    "The third element contains haze, so the answer is haze.",
  ],
  150: [
    "Find typed-ledger in the footer’s source.",
    "Look specifically for strong elements. The span containing ash is a different tag, so the first strong is the one containing elm.",
    "Read that first strong element’s text to get elm.",
  ],
  151: [
    "Find only-ledger in the footer’s source and compare its child tags.",
    "It has two span children and exactly one em child. The em contains quartz.",
    "The word in the sole em element is quartz.",
  ],
  152: [
    'Find the link inside reference-ledger and read href="#referenced-word".',
    'The # fragment points to an ID on this page. Find the paragraph with id="referenced-word".',
    "That paragraph’s text is linden, so the answer is linden.",
  ],
  153: [
    "Find header-miniature in the site header using Page source or Elements.",
    "Follow the template content through article → header → h2. Templates keep their contents inert rather than displaying them.",
    "The miniature document’s heading reads calico.",
  ],
  154: [
    "Find ranked-letters in the footer and pair each span’s text with its data-rank.",
    "Sort the ranks numerically: 1→R, 2→A, 3→V, 4→E, 5→N.",
    "Join the reordered letters to get raven.",
  ],
  155: [
    "Find discard-ledger and examine which spans have a data-discard attribute.",
    "Remove X and Q because that attribute is present on them. Keep O, A, T, H in their original order.",
    "The remaining text spells oath.",
  ],
  156: [
    "Find svg-ledger in the footer’s source. It is a hidden SVG image.",
    "Read the title element inside that SVG rather than the path that draws its shape.",
    "The SVG title contains tamarind.",
  ],
  157: [
    "Find the picture-sample template in the footer and inspect its img element.",
    'The img has alt="avocet". The alt attribute supplies alternate text for an image.',
    "Read that alternate text to get avocet.",
  ],
  158: [
    "Search Page source for text-ledger in the footer.",
    "Read between the two empty spans: <span></span>flint<span></span>. The letters belong to a text node outside both spans.",
    "That intervening text is flint.",
  ],
  159: [
    "Find tag-ledger and list its direct child tag names in document order: article, span, i, div, em.",
    "Take the first letter of each tag name: a, s, i, d, e.",
    "Those initials spell aside.",
  ],
  160: [
    "Inspect reverse-display in Elements or Page source and read its spans in document order.",
    "The spans contain R, O, O, T. flex-direction: row-reverse changes their visual placement without changing that DOM order.",
    "The question asks for DOM order, so the answer is root.",
  ],
  161: [
    "Inspect the site header’s data-receipt attribute: 6C 61 6E 74 65 72 6E.",
    "Decode the hexadecimal ASCII bytes: 6C→l, 61→a, 6E→n, 74→t, 65→e, 72→r, 6E→n.",
    "Join the decoded characters to get lantern.",
  ],
  162: [
    "Read the footer comment in Page source: encoding=base64; payload=cG9sbGVu.",
    "Translate cG9sbGVu with the Base64 decoder. Base64 can encode this six-byte word without any = padding.",
    "The payload decodes to pollen.",
  ],
  163: [
    'Find the head metadata named rotated-signal and read content="zrnqbj".',
    "Half of the 26-letter alphabet is 13, so apply ROT13: z→m, r→e, n→a, q→d, b→o, j→w.",
    "The decoded word is meadow.",
  ],
  164: [
    "Inspect pocket-tools and read data-bits: 01101001 01110010 01101001 01110011.",
    "Convert those binary ASCII bytes to decimal 105, 114, 105, 115, then to i, r, i, s.",
    "The stored message spells iris.",
  ],
  165: [
    "Find the head meta record decimal-description and read 109 117 114 109 117 114.",
    "Decode the decimal ASCII values: 109→m, 117→u, 114→r, 109→m, 117→u, 114→r.",
    "The resulting word is murmur.",
  ],
  166: [
    "Find radio-record in the footer’s source and read Delta Oscar Victor Echo.",
    "These NATO phonetic words stand for D, O, V, E respectively.",
    "Join the represented letters to get dove.",
  ],
  167: [
    "Inspect the home wordmark’s data-annotation attribute, whose value is field%20notes.",
    "URL decoding turns %20, the hexadecimal byte for a space, into a space between the words.",
    "The decoded annotation is field notes.",
  ],
  168: [
    "Find backward-record in the footer’s source and read its JSON fields: direction is reverse and payload is nelg.",
    "Follow the direction by reading the payload’s letters from right to left: g, l, e, n.",
    "The reversed payload is glen.",
  ],
  169: [
    "Read the head metadata: alphabet-key is atbash and mirrored-message is hroevi.",
    "Atbash pairs opposite alphabet letters. Apply h→s, r→i, o→l, e→v, v→e, i→r.",
    "The decoded message is silver.",
  ],
  170: [
    "Find the footer’s keyed-message JSON. It identifies Vigenère and gives the payload YTCX.",
    'Inspect the header to find data-key="KEY". Repeat it to K, E, Y, K and use A = 0 through Z = 25.',
    "Subtract key values from code values, wrapping modulo 26: 24−10=14, 19−4=15, 2−24 wraps to 4, 23−10=13.",
    "Values 14, 15, 4, 13 give O, P, E, N, so the answer is open.",
  ],
  171: [
    "Inspect body and read data-five-bit: 00001 00100 00000 00011.",
    "Convert the binary groups to 1, 4, 0, 3, then use the specified numbering A = 0, B = 1, and so on.",
    "Those values map to B, E, A, D, giving bead.",
  ],
  172: [
    "Find square-message in the footer. Its JSON gives the pairs 13 31 45 15 and says I/J share a cell.",
    "Build the five-row Polybius square: ABCDE / FGHIK / LMNOP / QRSTU / VWXYZ. In each pair, read row first and column second, starting at 1.",
    "13→C, 31→L, 45→U, 15→E, so the answer is clue.",
  ],
  173: [
    "Inspect the notebook’s data-rails attribute, which holds SCEERT.",
    "Split it into equal rails SCE and ERT. The first rail holds odd positions, and the second holds even positions.",
    "Alternate between rails: S, E, C, R, E, T. This spells secret.",
  ],
  174: [
    "Find truth-ledger in the footer and read each record’s keep flag.",
    "Remove X and Q because keep is false. Retain the true records D, A, W, N without sorting.",
    "Join the retained letters to get dawn.",
  ],
  175: [
    "Find sorted-ledger in the footer and use the numeric n field to order the records.",
    "Ranks 1 through 6 give P, E, B, B, L, E.",
    "Join their ch values in that order to get pebble.",
  ],
  176: [
    "Read the footer comment: base=8; bytes=113 105 131. The base field identifies octal numbers.",
    "Convert to decimal: 113₈ = 75, 105₈ = 69, and 131₈ = 89.",
    "ASCII 75, 69, 89 are K, E, Y, giving key.",
  ],
  177: [
    'Inspect pocket-tools and read data-roman="XLIX".',
    "Split the numeral into subtractive pairs: XL = 50 − 10 = 40 and IX = 10 − 1 = 9.",
    "Add 40 + 9 = 49, so the decimal answer is 49.",
  ],
  178: [
    "Find entity-ledger in the footer’s source and read the payload &#107;&#101;&#121;.",
    "Each &#number; is a decimal HTML character reference: 107→k, 101→e, 121→y.",
    "Decode and join the characters to get key.",
  ],
  179: [
    "Find the certificate meta record in the head. Its content says base64: dHNhZQ==; then reverse.",
    "Base64 decoding produces tsae. Apply the second instruction to reverse that intermediate text.",
    "tsae backwards is east.",
  ],
  180: [
    "Find local-route in the footer and read its href: ./?word=way%70oint#keep-going.",
    "Select the query value named word, which is way%70oint. Decode %70 as the letter p; the # fragment is separate.",
    "The decoded value is waypoint.",
  ],
  181: [
    'Inspect the header and read data-beginning="sun".',
    'Inspect the footer and read data-ending="flower".',
    "Join beginning then ending: sun + flower gives sunflower.",
  ],
  182: [
    "Find the footer comment coded-note=sdshu.",
    "Read the header CSS custom property --rotation-places: 3 to learn the shift amount.",
    "Move each coded letter back three places: s→p, d→a, s→p, h→e, u→r.",
    "The result spells paper.",
  ],
  183: [
    "Find folded-message in the footer and read the payload NSMB.",
    "Find the header template folded-key. Its text is KEY, so repeat the key as K, E, Y, K.",
    "Using A = 0, subtract key from code modulo 26: 13−10=3, 18−4=14, 12−24 wraps to 14, 1−10 wraps to 17.",
    "Values 3, 14, 14, 17 give D, O, O, R, so the answer is door.",
  ],
  184: [
    "Find wrapped-mirror in the footer. Its JSON specifies Base64 followed by Atbash, with payload aGdsbXY=.",
    "Base64 decoding gives hglmv.",
    "Apply Atbash’s reversed alphabet: h→s, g→t, l→o, m→n, v→e.",
    "The final word is stone.",
  ],
  185: [
    'Inspect the notebook and read data-reading-order="3,1,2".',
    "Find three-fragments in the footer: piece 1 is CHI, piece 2 is VE, and piece 3 is AR.",
    "Follow the specified order: AR + CHI + VE gives archive.",
  ],
  186: [
    'Find ready-boxes and keep the children with data-state="ready". Remove the waiting X.',
    "Use the CSS order values rather than DOM position: ready1 is F, ready2 E, ready3 R, ready4 N.",
    "Read the selected boxes in that visual order to get fern.",
  ],
  187: [
    'Inspect the header and read data-property="--buried-word". This names the property to find.',
    'Search the entry CSS for --buried-word. It is defined on body with the value "tendril".',
    "Follow the pointer to its value to get tendril.",
  ],
  188: [
    "Read the header’s aria-describedby value, encoded-description.",
    "Find the element with that ID in the footer. Its text is Y2luZGVy.",
    "Decode the referenced text as Base64 to get cinder.",
  ],
  189: [
    "Find chosen-field in the footer. Its read field says west, which selects the west field rather than east.",
    "The selected payload is c3BydWNl, and encoding says base64.",
    "Base64 decoding that payload gives spruce.",
  ],
  190: [
    "Read the three piece comments in the footer’s source.",
    "Sort by their written numbers rather than their source positions: piece 1 is af, piece 2 ter, piece 3 glow.",
    "Join af + ter + glow without spaces to get afterglow.",
  ],
  191: [
    "Find dimension-message and inspect its span widths in DOM order: 3px, 15px, 4px, 5px.",
    "Remove the units and use A = 1 through Z = 26: 3→C, 15→O, 4→D, 5→E.",
    "The measured letters spell code.",
  ],
  192: [
    "Find opacity-message and identify the spans matched by .faded { opacity: 0; }.",
    "Those invisible distractors contain X and Q. Exclude them, keeping O, P, A, L in DOM order.",
    "Join the remaining letters to get opal.",
  ],
  193: [
    'Find the outer fold-directory template in the footer and read data-read="fold-three".',
    "Inside its content, select the nested template whose ID is fold-three, rather than fold-one or fold-two.",
    "The selected template’s text is acorn.",
  ],
  194: [
    "Find reversed-bytes in the footer. The JSON gives order: reverse and hex: 77 6F 6C 67.",
    "Reverse the sequence of whole bytes to 67 6C 6F 77. Keep the two digits within each byte together.",
    "Decode those hexadecimal ASCII bytes: 67→g, 6C→l, 6F→o, 77→w, giving glow.",
  ],
  195: [
    "Inspect silent-items and select only elements with the hidden attribute. A class named sr-only is a different mechanism and does not meet that condition.",
    "The selected text, in DOM order, is river, oak, orbit, tide. The decoy is excluded.",
    "Take their initials R, O, O, T to get root.",
  ],
  196: [
    "Find last-filter in the footer and discard the X record, whose keep flag is false.",
    "Sort the true records by rank: 1→Z, 2→B, 3→G, 4→U. This gives the intermediate text ZBGU.",
    "Apply ROT13: Z→M, B→O, G→T, U→H.",
    "The final word is moth.",
  ],
  197: [
    "Read the footer’s data-ledger-reference attribute: 112,106,122,166,120,121.",
    "Look up those entries in Your index, in that exact order: SHORE, HOLLOW, AMBER, DOVE, OUTSIDE, WILLOW.",
    "Take each answer’s first letter: S, H, A, D, O, W. They spell shadow.",
  ],
  198: [
    'Find the head meta record last-shift and read content="cfzpoe".',
    "Read the footer comment for its instruction: move every letter back one place.",
    "Apply c→b, f→e, z→y, p→o, o→n, e→d to get beyond.",
  ],
  199: [
    "Read the footer comment’s reference order: 121 / 164 / 119 / 166 / 120 / 180.",
    "Look up the corresponding answers in Your index: WILLOW, IRIS, NEST, DOVE, OUTSIDE, WAYPOINT.",
    "Their first letters W, I, N, D, O, W spell window.",
  ],
  200: [
    "Read the document head comment: “final promise, first word: keep”.",
    "Read the footer comment: “final promise, last word: looking”.",
    "Join the first word and last word in that order to complete the promise: keep looking.",
  ],
};

export function getSolutionSteps(puzzle) {
  return solutionSteps[puzzle.id + 1];
}
