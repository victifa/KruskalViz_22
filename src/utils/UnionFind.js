/* eslint-disable no-unused-vars */
import { stdNode } from "@/utils/std.js";

export class UnionFind{
    /**
     * 创建新的并查集
     * @param {stdNode[]} nodes
     */
    constructor(nodes) {
        this.parent = new Map()
        this.rank = new Map()
        nodes.forEach(node => {
            // 所有节点自成一棵树，秩为0
            this.parent.set(node.getId(), node.getId())
            this.rank.set(node.getId(), 0)
        })
    }

    /**
     * 查找节点的根节点
     * @param {string} x - 节点ID
     * @returns {string} 根节点ID
     */
    find(x) {
        // 如果当前元素的父节点不是它自身，说明它不是根节点
        if (this.parent.get(x) !== x) {
            // 将当前元素的根节点设置为它父节点的父节点
            this.parent.set(x, this.find(this.parent.get(x)))
        }
        // 返回根节点
        return this.parent.get(x)
    }

    /**
     * 合并两个节点所在的集合
     * @param {string} x - 第一个节点ID
     * @param {string} y - 第二个节点ID
     * @return {boolean} 如果合并成功返回true，否则返回false
     */
    union(x, y) {
        const rootX = this.find(x)
        const rootY = this.find(y)

        // 如果两个节点已经在同一个集合中，则不需要合并
        if (rootX === rootY) return false

        // 根据秩进行合并
        // x秩 < y秩，x所在树接到y所在树上，x的根节点变为y的根节点(rootX接到rootY上)
        if (this.rank.get(rootX) < this.rank.get(rootY)) {
            this.parent.set(rootX, rootY)
        } 
        // x秩 > y秩，y所在树接到x所在树上，y的根节点变为x的根节点(rootY接到rootX上)
        else if (this.rank.get(rootX) > this.rank.get(rootY)) {
            this.parent.set(rootY, rootX)
        } 
        // x秩 == y秩，y所在树接到x所在树上，y的根节点变为x的根节点(rootY接到rootX上)
        else {
            this.parent.set(rootY, rootX)
            this.rank.set(rootX, this.rank.get(rootX) + 1)
        }
        return true
    }

    /**
     * 检查两个节点是否在同一个集合中 / 判断两个节点是否连通
     * @param {string} x - 第一个节点ID
     * @param {string} y - 第二个节点ID
     * @return {boolean} 如果在同一个集合中返回true，否则返回false
     */ 
    isConnected(x, y) {
        return this.find(x) === this.find(y)
    }
}