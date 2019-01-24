# mem
memory manager using a linked list in JS

This is a demo of using a linked list to manage memory allocation and de-allocation. The demo is written in Javascript.

The original specification of the problem was to have the allocation call return a pointer to char in a buffer. This is
simulated by returning an index of an array representing the memory buffer.

A linked list was used since each node can represent a chunk of memory. We store the size of the chunk, and references to
the previous and next chunks sequentially, and whether or not that chunk is allocated. It is disallowed to have sequentially
unallocated chunks. The algorithm will combine such chunks of memory.

An allocation request will traverse the linked list and try to find an unallocated node that is large enough to fulfil the
request. If the allocation request is smaller than a found unallocated node, the node in question will be decreased in size
and a new node will be inserted to represent the leftover unallocated space.


## to install
npm install

## to run tests
npm run test
