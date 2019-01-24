/**
 * Simulate a buffer of memory using an Array.
 * Creating the memory manager would consist of calling the constructor of MemoryManager with a pointer
 * to the buffer and the size of the buffer. Since we're simulating this, and you can't pass a reference
 * to an array in Javascript, let's just create the array in the MemoryManager.
 */
class MemoryManager {

  /**
   * @param {number} bufferSize the size of the buffer
   */
  constructor(bufferSize) {
    // In Javascript array's are dynamically sized. Calling `this.buffer.length` would return the length of the array.
    this.buffer = new Array(bufferSize);

    // firstChunk is a pointer to the first node of the linked list that keeps track of the chunks of memory.
    this.firstChunk = new ChunkNode(0, bufferSize, false, null, null);
  }

  /**
   *
   * @param {number} size the size of a chunk of memory to allocate
   * @returns {number|null} index of the start of the allocated chunk of memory or `null` if we cannot allocate the memory
   */
  alloc(size) {
    // find a chunk
    let currentChunk = this.firstChunk;
    do {
      if (!currentChunk.allocated) {
        if (currentChunk.size === size) {
          // All we need to do is to flip the allocated flag
          currentChunk.allocated = true;
          return currentChunk.index;
        } else if (currentChunk.size > size) {
          // Store the size of the remaining chunk of memory
          const remainderSize = currentChunk.size - size;
          currentChunk.size = size;
          currentChunk.allocated = true;
          if (currentChunk.nextNode && !currentChunk.nextNode.allocated) {
            // If the next node exists and it is unallocated,
            // combine the two chunks by decreasing its index and increasing its size by remainderSize
            currentChunk.nextNode.index -= remainderSize;
            currentChunk.nextNode.size += remainderSize;
          } else {
            // If there isn't a next node, or if the next node is allocated, then we create an unallocated
            // node to represent the leftover space.
            const unallocatedChunk = new ChunkNode(
              currentChunk.index+size,
              remainderSize,
              false,
              currentChunk,
              currentChunk.nextNode,
            );
            currentChunk.nextNode = unallocatedChunk;
          }
          return currentChunk.index;
        } else {
          // size requested is too large, no op (this is a dead branch but left here for documentation)
        }
      }

      // current chunk is allocated, so we have to move on to the next node
      currentChunk = currentChunk.nextNode;
    } while(currentChunk);

    // If we get to here, then we traversed the entire linked list w/o allocating a chunk of memory
    return null;
  }

  /**
   *
   * @param {number} index the "pointer" to the chunk of memory to free up
   * @returns {boolean} `true` if successfully deallocated memory, `false` if unable to find chunk
   */
  free(index) {
    let currentChunk = this.firstChunk;
    do {
      if (currentChunk.index === index) {
        if (!currentChunk.allocated) {
          // For some reason we tried to unallocate non-allocated memory.
          // TODO: Should we throw an error instead?
          console.log('current chunk is not allocated');
          return false;
        }

        // Case 1: we can just flip the chunk to unallocated
        if (
          (!currentChunk.prevNode || currentChunk.prevNode.allocated) &&
          (!currentChunk.nextNode || currentChunk.nextNode.allocated)
        ) {
          currentChunk.allocated = false;
          return true;
        } else if (
          (currentChunk.prevNode && !currentChunk.prevNode.allocated) &&
          (currentChunk.nextNode && !currentChunk.nextNode.allocated)
        ) {
          // Case 2: both previous and next exist, and they are unallocated
          currentChunk.prevNode.size += (currentChunk.size + currentChunk.nextNode.size);
          currentChunk.prevNode.allocated = false;
          currentChunk.prevNode.nextNode = currentChunk.nextNode.nextNode;

          // We splice out currentChunk and the next node
          currentChunk.nextNode = null;
          currentChunk = null;

          return true;
        } else if (currentChunk.prevNode && !currentChunk.prevNode.allocated) {
          // only previous node is unallocated
          currentChunk.prevNode.size += currentChunk.size;
          currentChunk.allocated = false;
          currentChunk.prevNode.nextNode = currentChunk.nextNode;

          // Splice out the current node
          currentChunk = null;

          return true;
        } else if (currentChunk.nextNode && !currentChunk.nextNode.allocated) {
          // only next node is unallocated
          currentChunk.size += currentChunk.nextNode.size;
          currentChunk.allocated = false;
          currentChunk.nextNode = currentChunk.nextNode.nextNode;

          // Splice out the next node
          currentChunk.nextNode = null;

          return true;
        }
      }
      // Advance to next node
      currentChunk = currentChunk.nextNode;
    } while(currentChunk);

    // If we made it here, we didn't find the chunk of memory to deallocate
    return false;
  }
}


/**
 * Class representing the chunks of memory as nodes of a linked list.
 */
class ChunkNode {

  /**
   *
   * @param {number} index the start index of this chunk of memory
   * @param {number} size size of this chunk of memory
   * @param {boolean} allocated true if this chunk is allocated, false if not
   * @param {ChunkNode} prevNode "pointer" to the previous node, which is the previous chunk of memory
   * @param {ChunkNode} nextNode "pointer" to the next node, which is the next chunk of memory
   */
  constructor(index, size, allocated, prevNode, nextNode) {
    this.index = index;
    this.size = size;
    this.allocated = allocated;
    this.prevNode = prevNode;
    this.nextNode = nextNode;
  }
}

module.exports = MemoryManager;
