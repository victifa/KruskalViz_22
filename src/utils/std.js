export class stdNode {
    /**
     * @param {string} id
     * @param {number} x
     * @param {number} y
     */
    constructor(id = '', x = 0, y = 0) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    getId() { return this.id; }
    getX() { return this.x; }
    getY() { return this.y; }

    setId(id) { this.id = id; }
    setX(x) { this.x = x; }
    setY(y) { this.y = y; }

    toString() {    
        return `Node(id = ${this.id}, x = ${this.x}, y = ${this.y})`;
    }
}

export class stdEdge {
    /**
     * 
     * @param {string} id `${from.getId()}${to.getId()}` 唯一标识符，由起点和终点的ID组成
     * @param {stdNode} from
     * @param {stdNode} to
     * @param {number} weight
     */
    constructor(from = new stdNode(), to = new stdNode(), weight = 0) {
        this.id = from.getId() + to.getId(); // 唯一标识符
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    getId() { return this.id; }
    getFrom() { return this.from; }
    getTo() { return this.to; }
    getWeight() { return this.weight; }

    setId(id) { this.id = id; }
    setFrom(from) { this.fromNode = from; }
    setTo(to) { this.toNode = to; }
    setWeight(weight) { this.weight = weight; }

    toString() {
        return `Edge(<${this.from.getId()}, ${this.to.getId()}>, weight = ${this.weight})`;
    }
}

export class Validation {
    constructor(isValid = true, msg = '') {
        this.isValid = isValid;
        this.msg = msg;
    }

    getIsValid() { return this.isValid; }
    getMsg() { return this.msg; }

    setIsValid(isValid) { this.isValid = isValid; }
    setMsg(msg) { this.msg = msg; }

    toString() {
        return `Validation(isValid = ${this.isValid}, msg = "${this.msg}")`;
    }
}