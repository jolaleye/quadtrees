import _ from 'lodash';

class Quadtree {
  constructor(bounds) {
    this.bounds = bounds;
    this.capacity = 10;
    this.nodes = [];
    this.objects = [];
  }

  split = () => {
    const { x, y, width, height } = this.bounds;
    const subWidth = width / 2;
    const subHeight = height / 2;

    // north west -> clockwise
    this.nodes.push(
      new Quadtree({ x: x - subWidth, y: y - subHeight, width: subWidth, height: subHeight }),
      new Quadtree({ x: x + subWidth, y: y - subHeight, width: subWidth, height: subHeight }),
      new Quadtree({ x: x - subWidth, y: y + subHeight, width: subWidth, height: subHeight }),
      new Quadtree({ x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight }),
    );

    // move children to new subnodes
    const items = this.objects;
    this.objects = [];
    items.forEach(item => this.insert(item));
  }

  // find the subnode that contains the item
  findContainer = item => this.nodes.findIndex(node => node.contains(item));

  contains = item => (
    item.x + item.radius <= this.bounds.x + this.bounds.width &&
    item.x - item.radius >= this.bounds.x - this.bounds.width &&
    item.y + item.radius <= this.bounds.y + this.bounds.height &&
    item.y - item.radius >= this.bounds.y - this.bounds.height
  );

  insert = item => {
    if (!this.contains(item)) return;

    // if this node has subnodes, try to insert the item into one of them
    if (!_.isEmpty(this.nodes)) {
      // find the node that the item fits into
      const index = this.findContainer(item);
      if (index !== -1) {
        this.nodes[index].insert(item);
        return;
      }
    }

    // if the node doesn't have subnodes or the item doesn't fit in one, insert it here
    this.objects.push(item);

    // split if this node has exceeded capacity
    if (this.objects.length >= this.capacity && _.isEmpty(this.nodes)) {
      this.split();
    }
  }

  // return collision candidates
  retrieve = item => {
    let candidates = this.objects;

    // if this node has subnodes...
    if (!_.isEmpty(this.nodes)) {
      const index = this.findContainer(item);
      // if the item is within a subnode, retrieve from that node
      if (index !== -1) candidates = candidates.concat(this.nodes[index].retrieve(item));
      // otherwise retrieve from all subnodes
      else {
        this.nodes.forEach(node => {
          candidates = candidates.concat(node.retrieve(item));
        });
      }
    }

    return candidates;
  }

  // clear the entire tree
  clear = () => {
    this.objects = [];
    this.nodes.forEach(node => node.clear());
    this.nodes = [];
  }
}

export default Quadtree;
