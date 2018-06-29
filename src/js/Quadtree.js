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
  }

  // find the child node that contains the item
  findContainer = item => this.nodes.findIndex(node => node.contains(item, node));

  contains = (item, node) => (
    item.x <= node.bounds.x + node.bounds.width &&
    item.x >= node.bounds.x - node.bounds.width &&
    item.y <= node.bounds.y + node.bounds.height &&
    item.y >= node.bounds.y - node.bounds.height
  );

  insert = item => {
    // if this node has child nodes, insert the object into one of them
    if (!_.isEmpty(this.nodes)) {
      // find the correct node to insert the item into
      const index = this.findContainer(item);
      if (index === -1) return;

      this.nodes[index].insert(item);
      return;
    }

    // if this node does not have children nodes, insert the item here
    this.objects.push(item);

    // if this node has reached capacity
    if (this.objects.length > this.capacity) {
      if (_.isEmpty(this.nodes)) this.split();

      // move objects to their containing subnodes
      this.objects.forEach(object => {
        // find the correct node to insert the item into
        const index = this.findContainer(object);
        if (index === -1) return;

        this.nodes[index].insert(object);
      });

      // remove objects from this node
      this.objects = [];
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
