
const MemoryManager = require('./mem');

test('able to allocate a chunk of memory', () => {
  const mm = new MemoryManager(10);
  expect(mm.alloc(10)).toBe(0);
});

test('able to free a chunk of memory', () => {
  const mm = new MemoryManager(10);
  mm.alloc(10)
  expect(mm.free(0)).toBeTruthy();
});

test(
  'to be unable to allocate a chunk of memory too large for the buffer',
  () => {
    const mm = new MemoryManager(10);
    expect(mm.alloc(11)).toBeNull();
    expect(mm.firstChunk.allocated).toBeFalsy();
  }
);

test(
  'able to free a chunk and re-allocate that chunk',
  () => {
    const mm = new MemoryManager(10);
    mm.alloc(10);
    mm.free(0);
    expect(mm.alloc(10)).toBe(0);
  }
);

test(
  'to be unable to free a chunk of memory when given an incorrect pointer',
  () => {
    const mm = new MemoryManager(10);
    mm.alloc(10);
    expect(mm.free(1)).toBeFalsy();
  }
);

test(
  'to be unable to find a chunk to allocate',
  () => {
    const mm = new MemoryManager(10);
    mm.alloc(10);
    expect(mm.alloc(1)).toBeNull();
  }
);

test(
  'to be able to find a chunk to allocate between two chunks of allocated memory',
  () => {
    const mm = new MemoryManager(10);
    mm.alloc(1);
    mm.alloc(8);
    mm.alloc(1);
    mm.free(1);
    expect(mm.alloc(1)).toBe(1);
  }
);

test(
  'freeing a chunk betwewen two free chunks combines them',
  () => {
    const mm = new MemoryManager(10);
    mm.alloc(1);
    mm.alloc(1);
    mm.alloc(1);
    mm.alloc(1);
    mm.free(0);
    mm.free(2);
    expect(mm.free(1)).toBeTruthy();
    expect(mm.firstChunk.index).toBe(0);
    expect(mm.firstChunk.size).toBe(3);
  }
);
