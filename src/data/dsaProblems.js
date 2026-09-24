const starterCode = {
  java: `class Solution {
    // Write your solution here
}`,
  python: `class Solution:
    # Write your solution here
    pass`,
  javascript: `// Write your solution here`
};

const leetcodeSignatures = {
  1: {
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[] {};
    }
}`,
    python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        return []`,
    javascript: `/** @param {number[]} nums @param {number} target @return {number[]} */
function twoSum(nums, target) {
  return [];
}`
  },
  2: {
    java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        return false;
    }
}`,
    python: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return False`,
    javascript: `/** @param {number[]} nums @return {boolean} */
function containsDuplicate(nums) {
  return false;
}`
  },
  14: {
    java: `class Solution {
    public int maxProfit(int[] prices) {
        return 0;
    }
}`,
    python: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        return 0`,
    javascript: `/** @param {number[]} prices @return {number} */
function maxProfit(prices) {
  return 0;
}`
  },
  20: {
    java: `class Solution {
    public boolean isValid(String s) {
        return false;
    }
}`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        return False`,
    javascript: `/** @param {string} s @return {boolean} */
function isValid(s) {
  return false;
}`
  },
  26: {
    java: `class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}`,
    python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        return -1`,
    javascript: `/** @param {number[]} nums @param {number} target @return {number} */
function search(nums, target) {
  return -1;
}`
  },
  72: {
    java: `class Solution {
    public int climbStairs(int n) {
        return 0;
    }
}`,
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        return 0`,
    javascript: `/** @param {number} n @return {number} */
function climbStairs(n) {
  return 0;
}`
  }
};

/* const examplesById = {
  1: [['nums = [2,7,11,15], target = 9', '[0,1]', 'nums[0] + nums[1] equals 9.'], 2: [['nums = [1,2,3,1]', 'true', 'The value 1 appears twice.']],
  3: [['s = "anagram", t = "nagaram"', 'true', 'Both strings contain the same character counts.']], 4: [['strs = ["eat","tea","tan","ate","nat","bat"]', '[["bat"],["nat","tan"],["ate","eat","tea"]]', 'Words with identical character counts belong together.']],
  5: [['nums = [1,1,1,2,2,3], k = 2', '[1,2]', '1 and 2 occur most frequently.']], 6: [['nums = [1,2,3,4]', '[24,12,8,6]', 'Each position excludes its own value.']],
  7: [['board = valid partially-filled Sudoku', 'true', 'No row, column, or 3x3 box repeats a digit.']], 8: [['nums = [100,4,200,1,3,2]', '4', 'The consecutive sequence is 1, 2, 3, 4.']],
  9: [['s = "A man, a plan, a canal: Panama"', 'true', 'After normalization it reads the same in reverse.']], 10: [['numbers = [2,7,11,15], target = 9', '[1,2]', 'The problem uses one-based indices.']],
  11: [['nums = [-1,0,1,2,-1,-4]', '[[-1,-1,2],[-1,0,1]]', 'Both unique triplets sum to zero.']], 12: [['height = [1,8,6,2,5,4,8,3,7]', '49', 'Choose the lines at indices 1 and 8.']],
  13: [['height = [0,1,0,2,1,0,1,3,2,1,2,1]', '6', 'Six units of water are trapped.']], 14: [['prices = [7,1,5,3,6,4]', '5', 'Buy at 1 and sell at 6.']],
  15: [['s = "abcabcbb"', '3', '"abc" is the longest valid substring.']], 16: [['s = "AABABBA", k = 1', '4', 'Replace one character to form a length-four block.']],
  17: [['s1 = "ab", s2 = "eidbaooo"', 'true', 's2 contains the permutation "ba".']], 18: [['s = "ADOBECODEBANC", t = "ABC"', '"BANC"', 'This is the shortest substring containing A, B, and C.']],
  19: [['nums = [1,3,-1,-3,5,3,6,7], k = 3', '[3,3,5,5,6,7]', 'Take the maximum from each window.']], 20: [['s = "()[]{}"', 'true', 'Every opening bracket closes in the proper order.']],
  21: [['operations = [push(-2), push(0), push(-3), getMin()]', '-3', 'The minimum stored value is -3.']], 22: [['tokens = ["2","1","+","3","*"]', '9', '(2 + 1) * 3 equals 9.']],
  23: [['n = 3', '["((()))","(()())","(())()","()(())","()()()"]', 'There are five valid combinations.']], 24: [['temperatures = [73,74,75,71,69,72,76,73]', '[1,1,4,2,1,1,0,0]', 'Each value is days until a warmer temperature.']],
  25: [['heights = [2,1,5,6,2,3]', '10', 'The largest rectangle has area 10.']], 26: [['nums = [-1,0,3,5,9,12], target = 9', '4', 'Target appears at index 4.']],
  27: [['matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', 'true', '3 is present in the first row.']], 28: [['piles = [3,6,7,11], h = 8', '4', 'Speed 4 completes the piles in eight hours.']],
  29: [['nums = [3,4,5,1,2]', '1', '1 is the smallest rotated value.']], 30: [['nums = [4,5,6,7,0,1,2], target = 0', '4', 'Target is at index 4.']],
  31: [['nums1 = [1,3], nums2 = [2]', '2.0', 'The combined sorted order is [1,2,3].']], 32: [['head = [1,2,3,4,5]', '[5,4,3,2,1]', 'Reverse the node links.']],
  33: [['list1 = [1,2,4], list2 = [1,3,4]', '[1,1,2,3,4,4]', 'Merge while preserving sort order.']], 34: [['head = [1,2,3,4]', '[1,4,2,3]', 'Alternate nodes from the start and end.']],
  35: [['head = [1,2,3,4,5], n = 2', '[1,2,3,5]', 'Remove the second node from the end.']], 36: [['head = [3,2,0,-4], pos = 1', 'true', 'The tail connects to the node at index 1.']],
  37: [['lists = [[1,4,5],[1,3,4],[2,6]]', '[1,1,2,3,4,4,5,6]', 'Merge every sorted list.']], 38: [['capacity = 2; put(1,1); put(2,2); get(1)', '1', 'Key 1 is present and becomes recently used.']],
  39: [['root = [4,2,7,1,3,6,9]', '[4,7,2,9,6,3,1]', 'Swap left and right children recursively.']], 40: [['root = [3,9,20,null,null,15,7]', '3', 'The deepest level has depth three.']],
  41: [['p = [1,2,3], q = [1,2,3]', 'true', 'Values and structure match.']], 42: [['root = [3,4,5,1,2], subRoot = [4,1,2]', 'true', 'The subtree rooted at 4 matches.']],
  43: [['root = [3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]', 'Return nodes one level at a time.']], 44: [['root = [2,1,3]', 'true', 'All left values are smaller and right values larger.']],
  45: [['root = [3,1,4,null,2], k = 1', '1', 'The first inorder value is 1.']], 46: [['preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', '[3,9,20,null,null,15,7]', 'Both traversals describe the constructed tree.']],
  47: [['root = [-10,9,20,null,null,15,7]', '42', 'The best path is 15 -> 20 -> 7.']], 48: [['root = [1,2,3,null,null,4,5]', 'serializable tree', 'Deserializing must rebuild an equivalent tree.']],
  49: [['operations = [insert("apple"), search("apple"), startsWith("app")]', '[null,true,true]', 'The inserted word and prefix are found.']], 50: [['operations = [addWord("bad"), search(".ad")]', '[null,true]', 'The dot wildcard matches one character.']],
  51: [['board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', '["eat","oath"]', 'Only these words can be formed in the board.']],
  52: [['nums = [3,2,1,5,6,4], k = 2', '5', '5 is the second-largest element.']], 53: [['operations = [postTweet(1,5), getNewsFeed(1)]', '[[5]]', 'A user sees their own newest tweet.']],
  54: [['operations = [addNum(1), addNum(2), findMedian()]', '1.5', 'The median of 1 and 2 is 1.5.']], 55: [['nums = [1,2,3]', '[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]', 'There are 2^3 subsets.']],
  56: [['candidates = [2,3,6,7], target = 7', '[[2,2,3],[7]]', 'Both combinations total seven.']], 57: [['nums = [1,2,3]', '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', 'Return every ordering.']],
  58: [['nums = [1,2,2]', '[[],[1],[2],[1,2],[2,2],[1,2,2]]', 'Duplicate subsets must not repeat.']], 59: [['board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', 'true', 'The word follows adjacent cells.']],
  60: [['s = "aab"', '[["a","a","b"],["aa","b"]]', 'Every part in each partition is a palindrome.']], 61: [['digits = "23"', '["ad","ae","af","bd","be","bf","cd","ce","cf"]', 'Combine the letters for each digit.']],
  62: [['n = 4', '2', 'There are two distinct valid board configurations.']], 63: [['grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', '3', 'There are three disconnected land groups.']],
  64: [['adjList = [[2,4],[1,3],[2,4],[1,3]]', 'deep copy', 'The clone has equal structure but different node references.']], 65: [['heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]', 'These cells reach both oceans.']],
  66: [['numCourses = 2, prerequisites = [[1,0]]', 'true', 'Take course 0 before course 1.']], 67: [['numCourses = 2, prerequisites = [[1,0]]', '[0,1]', 'This order respects the prerequisite.']],
  68: [['n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', 'true', 'The graph is connected and acyclic.']], 69: [['n = 5, edges = [[0,1],[1,2],[3,4]]', '2', 'There are two connected groups.']],
  70: [['words = ["wrt","wrf","er","ett","rftt"]', '"wertf"', 'This is one valid character order.']], 71: [['matrix = [[9,9,4],[6,6,8],[2,1,1]]', '4', 'One longest path is 1 -> 2 -> 6 -> 9.']],
  72: [['n = 3', '3', 'The step sequences are 1+1+1, 1+2, and 2+1.']], 73: [['nums = [1,2,3,1]', '4', 'Rob houses 1 and 3.']],
  74: [['nums = [2,3,2]', '3', 'Do not rob both first and last houses.']], 75: [['s = "babad"', '"bab" or "aba"', 'Both are longest palindromic substrings.']]
}; */

const examplesById = Object.fromEntries(`
1|nums = [2,7,11,15], target = 9|[0,1]|nums[0] + nums[1] equals 9.
2|nums = [1,2,3,1]|true|The number 1 occurs more than once.
3|s = anagram, t = nagaram|true|Both strings have the same character counts.
4|strs = [eat,tea,tan,ate,nat,bat]|[[bat],[nat,tan],[ate,eat,tea]]|Anagrams are grouped together.
5|nums = [1,1,1,2,2,3], k = 2|[1,2]|1 and 2 are the two most frequent values.
6|nums = [1,2,3,4]|[24,12,8,6]|Each result excludes the value at its own index.
7|board = valid partially-filled Sudoku|true|No row, column, or 3x3 box repeats a digit.
8|nums = [100,4,200,1,3,2]|4|The longest consecutive sequence is 1,2,3,4.
9|s = A man, a plan, a canal: Panama|true|Ignoring punctuation and case produces a palindrome.
10|numbers = [2,7,11,15], target = 9|[1,2]|The problem uses one-based indices.
11|nums = [-1,0,1,2,-1,-4]|[[-1,-1,2],[-1,0,1]]|These are the unique triplets with sum zero.
12|height = [1,8,6,2,5,4,8,3,7]|49|The best container uses heights 8 and 7.
13|height = [0,1,0,2,1,0,1,3,2,1,2,1]|6|Six units of water are trapped.
14|prices = [7,1,5,3,6,4]|5|Buy at 1 and sell at 6.
15|s = abcabcbb|3|abc is the longest substring without repeated characters.
16|s = AABABBA, k = 1|4|One replacement creates a repeating substring of length four.
17|s1 = ab, s2 = eidbaooo|true|s2 contains the permutation ba.
18|s = ADOBECODEBANC, t = ABC|BANC|BANC is the shortest substring containing A, B, and C.
19|nums = [1,3,-1,-3,5,3,6,7], k = 3|[3,3,5,5,6,7]|Take the maximum in every window of size three.
20|s = ()[]{}|true|All brackets close in the correct order.
21|push(-2), push(0), push(-3), getMin()|-3|The current minimum is -3.
22|tokens = [2,1,+,3,*]|9|(2 + 1) * 3 equals 9.
23|n = 3|5 combinations|There are five well-formed parenthesis combinations.
24|temperatures = [73,74,75,71,69,72,76,73]|[1,1,4,2,1,1,0,0]|Each value is days until a warmer temperature.
25|heights = [2,1,5,6,2,3]|10|The largest rectangle has area 10.
26|nums = [-1,0,3,5,9,12], target = 9|4|Target 9 is at index 4.
27|matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3|true|3 is present in the matrix.
28|piles = [3,6,7,11], h = 8|4|Speed 4 completes all piles in eight hours.
29|nums = [3,4,5,1,2]|1|1 is the minimum rotated value.
30|nums = [4,5,6,7,0,1,2], target = 0|4|Target 0 is at index 4.
31|nums1 = [1,3], nums2 = [2]|2.0|The combined sorted values are [1,2,3].
32|head = [1,2,3,4,5]|[5,4,3,2,1]|Reverse every link.
33|list1 = [1,2,4], list2 = [1,3,4]|[1,1,2,3,4,4]|Merge the two sorted lists.
34|head = [1,2,3,4]|[1,4,2,3]|Alternate nodes from the start and end.
35|head = [1,2,3,4,5], n = 2|[1,2,3,5]|Remove the second node from the end.
36|head = [3,2,0,-4], pos = 1|true|The tail links back to index 1.
37|lists = [[1,4,5],[1,3,4],[2,6]]|[1,1,2,3,4,4,5,6]|Merge all sorted lists.
38|capacity = 2; put(1,1); put(2,2); get(1)|1|Key 1 is available.
39|root = [4,2,7,1,3,6,9]|[4,7,2,9,6,3,1]|Swap every left and right child.
40|root = [3,9,20,null,null,15,7]|3|The deepest level has depth three.
41|p = [1,2,3], q = [1,2,3]|true|Both tree structure and values match.
42|root = [3,4,5,1,2], subRoot = [4,1,2]|true|The subtree rooted at 4 matches.
43|root = [3,9,20,null,null,15,7]|[[3],[9,20],[15,7]]|Return nodes level by level.
44|root = [2,1,3]|true|Every left value is smaller and every right value is larger.
45|root = [3,1,4,null,2], k = 1|1|The first inorder value is 1.
46|preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]|[3,9,20,null,null,15,7]|The traversals rebuild this tree.
47|root = [-10,9,20,null,null,15,7]|42|The best path is 15 to 20 to 7.
48|root = [1,2,3,null,null,4,5]|equivalent tree|Deserializing must recreate the original tree.
49|insert(apple), search(apple), startsWith(app)|[null,true,true]|The word and prefix are found.
50|addWord(bad), search(.ad)|[null,true]|The dot matches one character.
51|words = [oath,pea,eat,rain]|[eat,oath]|Only these words can be formed in the board.
52|nums = [3,2,1,5,6,4], k = 2|5|5 is the second-largest element.
53|postTweet(1,5), getNewsFeed(1)|[5]|A user sees their latest tweet.
54|addNum(1), addNum(2), findMedian()|1.5|The median of 1 and 2 is 1.5.
55|nums = [1,2,3]|8 subsets|A set of three values has eight subsets.
56|candidates = [2,3,6,7], target = 7|[[2,2,3],[7]]|Both combinations total seven.
57|nums = [1,2,3]|6 permutations|Three distinct values have six orderings.
58|nums = [1,2,2]|[[],[1],[2],[1,2],[2,2],[1,2,2]]|Duplicate subsets are removed.
59|word = ABCCED|true|The word follows adjacent board cells.
60|s = aab|[[a,a,b],[aa,b]]|Every part in each partition is a palindrome.
61|digits = 23|[ad,ae,af,bd,be,bf,cd,ce,cf]|Combine letters represented by the digits.
62|n = 4|2|There are two N-Queens solutions.
63|grid = [[1,1,0],[1,0,0],[0,1,1]]|2|There are two separate islands.
64|adjList = [[2,4],[1,3],[2,4],[1,3]]|deep copy|The cloned graph has equal structure and new nodes.
65|heights = sample 5 by 5 grid|7 cells|Seven cells can reach both oceans in the standard sample.
66|numCourses = 2, prerequisites = [[1,0]]|true|Complete course 0 before course 1.
67|numCourses = 2, prerequisites = [[1,0]]|[0,1]|This order respects the prerequisite.
68|n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]|true|The graph is connected without a cycle.
69|n = 5, edges = [[0,1],[1,2],[3,4]]|2|There are two connected components.
70|words = [wrt,wrf,er,ett,rftt]|wertf|This is one valid alien character order.
71|matrix = [[9,9,4],[6,6,8],[2,1,1]]|4|One path is 1 to 2 to 6 to 9.
72|n = 3|3|The sequences are 1+1+1, 1+2, and 2+1.
73|nums = [1,2,3,1]|4|Rob houses with values 1 and 3.
74|nums = [2,3,2]|3|Do not rob both first and last houses.
75|s = babad|bab or aba|Both are longest palindromic substrings.
`.trim().split('\n').map((line) => {
  const [id, input, output, explanation] = line.split('|');
  return [Number(id), [[input, output, explanation]]];
}));

const secondExamplesById = {
  1: ['nums = [3,2,4], target = 6', '[1,2]', 'The values 2 and 4 add up to 6.'],
  2: ['nums = [1,2,3,4]', 'false', 'Every value appears exactly once.'],
  3: ['s = rat, t = car', 'false', 'The character counts are different.'],
  14: ['prices = [7,6,4,3,1]', '0', 'No profitable transaction is possible.'],
  20: ['s = (]', 'false', 'The closing bracket does not match the opening bracket.'],
  26: ['nums = [-1,0,3,5,9,12], target = 2', '-1', 'The target does not occur in the sorted array.'],
  32: ['head = [1,2]', '[2,1]', 'The two nodes change order.'],
  72: ['n = 2', '2', 'The possible sequences are 1+1 and 2.']
};

const problem = (id, title, difficulty, category, description) => ({
  id: `blind-75-${id}`,
  title,
  difficulty,
  category,
  companies: ['Google', 'Amazon', 'Microsoft'],
  acceptance: 'Practice',
  description,
  inputFormat: 'Use the input values shown in the examples and return the required result.',
  outputFormat: 'Return the answer in the format shown in the examples.',
  examples: [
    ...(examplesById[id] || []).slice(0, 1).map(([input, output, explanation]) => ({ input, output, explanation })),
    ...(secondExamplesById[id]
      ? [{ input: secondExamplesById[id][0], output: secondExamplesById[id][1], explanation: secondExamplesById[id][2] }]
      : [{
        input: 'nums = []',
        output: 'Handle according to the problem constraints.',
        explanation: 'Check the smallest valid input before submitting.'
      }])
  ],
  constraints: [
    'Follow the input and output format shown in the examples.',
    'Return the required result for every valid input within the problem limits.',
    'Aim for the best time and space complexity you can justify.'
  ],
  starterCode: leetcodeSignatures[id] || starterCode,

});

export const DSA_PROBLEMS = [
  // Arrays & Hashing
  problem(1, '1. Two Sum', 'Easy', 'Arrays & Hashing', 'Given an integer array and a target, return indices of two values whose sum equals the target.'),
  problem(2, '217. Contains Duplicate', 'Easy', 'Arrays & Hashing', 'Determine whether an integer array contains any repeated value.'),
  problem(3, '242. Valid Anagram', 'Easy', 'Arrays & Hashing', 'Determine whether two strings are anagrams of one another.'),
  problem(4, '49. Group Anagrams', 'Medium', 'Arrays & Hashing', 'Group a list of strings into collections of anagrams.'),
  problem(5, '347. Top K Frequent Elements', 'Medium', 'Arrays & Hashing', 'Return the k most frequent elements in an integer array.'),
  problem(6, '238. Product of Array Except Self', 'Medium', 'Arrays & Hashing', 'Return an array where each position contains the product of every other element.'),
  problem(7, '36. Valid Sudoku', 'Medium', 'Arrays & Hashing', 'Determine whether a partially filled Sudoku board is valid.'),
  problem(8, '128. Longest Consecutive Sequence', 'Medium', 'Arrays & Hashing', 'Find the length of the longest sequence of consecutive integers.'),

  // Two Pointers
  problem(9, '125. Valid Palindrome', 'Easy', 'Two Pointers', 'Determine whether a string is a palindrome after ignoring non-alphanumeric characters and case.'),
  problem(10, '167. Two Sum II - Input Array Is Sorted', 'Medium', 'Two Pointers', 'In a sorted array, return indices of two values that add to the target.'),
  problem(11, '15. 3Sum', 'Medium', 'Two Pointers', 'Return all unique triplets in an array whose sum is zero.'),
  problem(12, '11. Container With Most Water', 'Medium', 'Two Pointers', 'Find two lines that form a container holding the maximum amount of water.'),
  problem(13, '42. Trapping Rain Water', 'Hard', 'Two Pointers', 'Calculate the total water trapped between bars in an elevation map.'),

  // Sliding Window
  problem(14, '121. Best Time to Buy and Sell Stock', 'Easy', 'Sliding Window', 'Find the maximum profit from one stock buy and one later sell.'),
  problem(15, '3. Longest Substring Without Repeating Characters', 'Medium', 'Sliding Window', 'Find the length of the longest substring with no repeated characters.'),
  problem(16, '424. Longest Repeating Character Replacement', 'Medium', 'Sliding Window', 'Find the longest substring obtainable after replacing at most k characters.'),
  problem(17, '567. Permutation in String', 'Medium', 'Sliding Window', 'Determine whether one string contains a permutation of another string.'),
  problem(18, '76. Minimum Window Substring', 'Hard', 'Sliding Window', 'Find the minimum substring of a string containing every character of another string.'),
  problem(19, '239. Sliding Window Maximum', 'Hard', 'Sliding Window', 'Return the maximum value in every window of size k.'),

  // Stack
  problem(20, '20. Valid Parentheses', 'Easy', 'Stack', 'Determine whether a string of brackets is properly balanced.'),
  problem(21, '155. Min Stack', 'Medium', 'Stack', 'Design a stack supporting push, pop, top, and minimum retrieval in constant time.'),
  problem(22, '150. Evaluate Reverse Polish Notation', 'Medium', 'Stack', 'Evaluate an arithmetic expression written in Reverse Polish Notation.'),
  problem(23, '22. Generate Parentheses', 'Medium', 'Stack', 'Generate all combinations of well-formed parentheses for n pairs.'),
  problem(24, '739. Daily Temperatures', 'Medium', 'Stack', 'For every day, return how many days until a warmer temperature.'),
  problem(25, '84. Largest Rectangle in Histogram', 'Hard', 'Stack', 'Find the area of the largest rectangle within a histogram.'),

  // Binary Search
  problem(26, '704. Binary Search', 'Easy', 'Binary Search', 'Find a target value in a sorted integer array.'),
  problem(27, '74. Search a 2D Matrix', 'Medium', 'Binary Search', 'Search a target in a matrix with sorted rows and ordered row ranges.'),
  problem(28, '875. Koko Eating Bananas', 'Medium', 'Binary Search', 'Find the minimum eating speed needed to finish all banana piles within h hours.'),
  problem(29, '153. Find Minimum in Rotated Sorted Array', 'Medium', 'Binary Search', 'Find the minimum element in a rotated sorted array of unique values.'),
  problem(30, '33. Search in Rotated Sorted Array', 'Medium', 'Binary Search', 'Find a target in a rotated sorted array of unique values.'),
  problem(31, '4. Median of Two Sorted Arrays', 'Hard', 'Binary Search', 'Find the median of two sorted arrays in logarithmic time.'),

  // Linked List
  problem(32, '206. Reverse Linked List', 'Easy', 'Linked List', 'Reverse a singly linked list and return its new head.'),
  problem(33, '21. Merge Two Sorted Lists', 'Easy', 'Linked List', 'Merge two sorted linked lists into one sorted list.'),
  problem(34, '143. Reorder List', 'Medium', 'Linked List', 'Reorder a linked list by alternating nodes from its ends.'),
  problem(35, '19. Remove Nth Node From End of List', 'Medium', 'Linked List', 'Remove the nth node from the end of a linked list.'),
  problem(36, '141. Linked List Cycle', 'Easy', 'Linked List', 'Determine whether a linked list contains a cycle.'),
  problem(37, '23. Merge K Sorted Lists', 'Hard', 'Linked List', 'Merge k sorted linked lists into a single sorted list.'),
  problem(38, '146. LRU Cache', 'Medium', 'Linked List', 'Design an LRU cache with constant-time get and put operations.'),

  // Trees
  problem(39, '226. Invert Binary Tree', 'Easy', 'Trees', 'Invert a binary tree by swapping each node’s children.'),
  problem(40, '104. Maximum Depth of Binary Tree', 'Easy', 'Trees', 'Return the maximum depth of a binary tree.'),
  problem(41, '100. Same Tree', 'Easy', 'Trees', 'Determine whether two binary trees are structurally identical with equal values.'),
  problem(42, '572. Subtree of Another Tree', 'Easy', 'Trees', 'Determine whether one binary tree occurs as a subtree of another.'),
  problem(43, '102. Binary Tree Level Order Traversal', 'Medium', 'Trees', 'Return binary tree node values level by level.'),
  problem(44, '98. Validate Binary Search Tree', 'Medium', 'Trees', 'Determine whether a binary tree is a valid binary search tree.'),
  problem(45, '230. Kth Smallest Element in a BST', 'Medium', 'Trees', 'Return the kth smallest value in a binary search tree.'),
  problem(46, '105. Construct Binary Tree from Preorder and Inorder Traversal', 'Medium', 'Trees', 'Construct a binary tree from preorder and inorder traversals.'),
  problem(47, '124. Binary Tree Maximum Path Sum', 'Hard', 'Trees', 'Find the maximum sum of any non-empty path in a binary tree.'),
  problem(48, '297. Serialize and Deserialize Binary Tree', 'Hard', 'Trees', 'Design an algorithm to serialize and deserialize a binary tree.'),

  // Tries
  problem(49, '208. Implement Trie (Prefix Tree)', 'Medium', 'Tries', 'Implement insert, search, and prefix-start operations for a trie.'),
  problem(50, '211. Design Add and Search Words Data Structure', 'Medium', 'Tries', 'Support adding words and searches containing a wildcard character.'),
  problem(51, '212. Word Search II', 'Hard', 'Tries', 'Find all dictionary words that can be formed in a character board.'),

  // Heap / Priority Queue
  problem(52, '215. Kth Largest Element in an Array', 'Medium', 'Heap / Priority Queue', 'Return the kth largest element in an unsorted array.'),
  problem(53, '355. Design Twitter', 'Medium', 'Heap / Priority Queue', 'Design a simplified Twitter feed with posts, follows, and a news feed.'),
  problem(54, '295. Find Median from Data Stream', 'Hard', 'Heap / Priority Queue', 'Maintain a data stream and return its median efficiently.'),

  // Backtracking
  problem(55, '78. Subsets', 'Medium', 'Backtracking', 'Return every possible subset of a set of unique integers.'),
  problem(56, '39. Combination Sum', 'Medium', 'Backtracking', 'Return combinations of candidates that sum to a target; candidates may repeat.'),
  problem(57, '46. Permutations', 'Medium', 'Backtracking', 'Return all permutations of an array of distinct integers.'),
  problem(58, '90. Subsets II', 'Medium', 'Backtracking', 'Return all unique subsets of an array that may contain duplicates.'),
  problem(59, '79. Word Search', 'Medium', 'Backtracking', 'Determine whether a word can be formed from adjacent board cells.'),
  problem(60, '131. Palindrome Partitioning', 'Medium', 'Backtracking', 'Partition a string so every substring in each partition is a palindrome.'),
  problem(61, '17. Letter Combinations of a Phone Number', 'Medium', 'Backtracking', 'Return all letter combinations represented by a phone-number digit string.'),
  problem(62, '51. N-Queens', 'Hard', 'Backtracking', 'Place n queens on an n by n board so none attack one another.'),

  // Graphs
  problem(63, '200. Number of Islands', 'Medium', 'Graphs', 'Count the number of islands in a grid of land and water cells.'),
  problem(64, '133. Clone Graph', 'Medium', 'Graphs', 'Create a deep copy of a connected undirected graph.'),
  problem(65, '417. Pacific Atlantic Water Flow', 'Medium', 'Graphs', 'Find cells from which water can flow to both the Pacific and Atlantic oceans.'),
  problem(66, '207. Course Schedule', 'Medium', 'Graphs', 'Determine whether all courses can be completed given prerequisite pairs.'),
  problem(67, '210. Course Schedule II', 'Medium', 'Graphs', 'Return a valid course completion order from prerequisite pairs.'),
  problem(68, '261. Graph Valid Tree', 'Medium', 'Graphs', 'Determine whether undirected edges form a valid tree.'),
  problem(69, '323. Number of Connected Components in an Undirected Graph', 'Medium', 'Graphs', 'Count connected components in an undirected graph.'),
  problem(70, '269. Alien Dictionary', 'Hard', 'Graphs', 'Infer a valid character order from an ordered list of alien-language words.'),
  problem(71, '329. Longest Increasing Path in a Matrix', 'Hard', 'Graphs', 'Find the longest strictly increasing path in a matrix.'),

  // Dynamic Programming
  problem(72, '70. Climbing Stairs', 'Easy', 'Dynamic Programming', 'Count distinct ways to reach the top when you can climb one or two steps.'),
  problem(73, '198. House Robber', 'Medium', 'Dynamic Programming', 'Find the maximum money that can be robbed without taking adjacent houses.'),
  problem(74, '213. House Robber II', 'Medium', 'Dynamic Programming', 'Find the maximum money that can be robbed from circularly arranged houses.'),
  problem(75, '5. Longest Palindromic Substring', 'Medium', 'Dynamic Programming', 'Return the longest palindromic substring in a given string.')
];
