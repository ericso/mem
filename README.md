# mem
memory manager using a linked list in JS

This is a demo of using a linked list to manage memory allocation and de-allocation. The demo is written in Javascript.

## to install
npm install

## to run tests
npm run test

## discussion
The original specification of the problem was to have the allocation call return a pointer to char in a buffer. This is
simulated by returning an index of an array representing the memory buffer.

A linked list was used since each node can represent a chunk of memory. We store the size of the chunk, the index (the pointer) to which this chunck starts in the array (the buffer), references to the previous and next chunks sequentially, and whether or not that chunk is allocated. It is disallowed to have sequentially unallocated chunks. The algorithm will combine such chunks of memory.

An allocation request will traverse the linked list and try to find an unallocated node that is large enough to fulfil the request. If the allocation request is smaller than a found unallocated node, the node in question will be decreased in size and a new node will be inserted to represent the leftover unallocated space.

A deallocation request will traverse the linked list and try to find a chunk who has an `index` provided in the deallocation request. If found, the algorithm will have to check the previous and next chunks to see if they are also deallocated, and combine the chunks appropriately.

### performance
An allocation and deallocation request requires traversal of the linked list. This is upper bounded by the size of the buffer, since it's possible to have single "byte" allocations filling up the buffer.

### improvements
It's to increase the speed at which we try to find the right node to deallocate, we could store the indicies in a hashmap where the values are references to the node in question. That would increase lookup time of a node to constant time.
