export const DSA_PROBLEMS = [
  {
    id: "dsa-1",
    title: "1. Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    companies: ["Google", "Microsoft", "Amazon"],
    acceptance: "52.4%",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
    ],
    starterCode: {
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your optimal solution here\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []`,
      javascript: `function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`
    },
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)"
  },
  {
    id: "dsa-2",
    title: "206. Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    companies: ["Amazon", "Adobe", "Apple"],
    acceptance: "76.1%",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
    ],
    starterCode: {
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n}`,
      python: `class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev = None\n        curr = head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev`,
      javascript: `function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr !== null) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`
    },
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)"
  },
  {
    id: "dsa-3",
    title: "146. LRU Cache",
    difficulty: "Hard",
    category: "Design & Data Structures",
    companies: ["Google", "Microsoft", "Meta", "Amazon"],
    acceptance: "42.8%",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations.",
    examples: [
      { input: "LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1);", output: "1" }
    ],
    starterCode: {
      java: `class LRUCache {\n    // Implement LRU Cache with DoublyLinkedList + HashMap\n    public LRUCache(int capacity) {\n    }\n    public int get(int key) {\n        return -1;\n    }\n    public void put(int key, int value) {\n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass`,
      javascript: `class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.map = new Map();\n    }\n    get(key) {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key);\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n}`
    },
    timeComplexity: "O(1)",
    spaceComplexity: "O(Capacity)"
  },
  {
    id: "dsa-4",
    title: "53. Maximum Subarray (Kadane's Algo)",
    difficulty: "Medium",
    category: "Dynamic Programming",
    companies: ["Google", "Microsoft", "Zomato", "Swiggy"],
    acceptance: "51.2%",
    description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6." }
    ],
    starterCode: {
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSoFar = nums[0];\n        int currMax = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            currMax = Math.max(nums[i], currMax + nums[i]);\n            maxSoFar = Math.max(maxSoFar, currMax);\n        }\n        return maxSoFar;\n    }\n}`,
      python: `class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        max_so_far = curr = nums[0]\n        for x in nums[1:]:\n            curr = max(x, curr + x)\n            max_so_far = max(max_so_far, curr)\n        return max_so_far`,
      javascript: `function maxSubArray(nums) {\n    let maxSoFar = nums[0];\n    let currMax = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currMax = Math.max(nums[i], currMax + nums[i]);\n        maxSoFar = Math.max(maxSoFar, currMax);\n    }\n    return maxSoFar;\n}`
    },
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)"
  }
];
