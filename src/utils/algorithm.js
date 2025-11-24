// eslint-disable-next-line no-unused-vars
import { stdEdge, stdNode } from "@/utils/std.js";
import { UnionFind } from "@/utils/UnionFind.js";

/**
 * 比较两个边，用于排序
 * @param {stdEdge} a 
 * @param {stdEdge} b 
 * @returns {bool} 按`Arrays.sort`要求，如果边a的权重小于边b的权重，则返回 -1, 大于则返回 1, 相等则返回 0
 */
const edgeLt = (a, b) => {
    if(a.getWeight() < b.getWeight()) return -1
    else if (a.getWeight() > b.getWeight()) return 1
    else return 0;
}

/**
 * @param {stdNode[]} nodes 所有节点的数组
 * @param {stdEdge[]} edges 所有边的数组
 * @returns {stdEdge[]} 最小生成树 / 森林的边数组
 */
export const Kruskal = (nodes, edges) => {
    if (nodes.length === 0) {
        alert('没有节点，无法构建最小生成树');
        return []
    }

    if (edges.length === 0) {
        alert('没有边，无法构建最小生成树');
        return []
    }
    
    // 浅拷贝边数组，并从小到大排序
    const sortedEdge = [...edges].sort(edgeLt); 

    // 初始化并查集
    const unionFind = new UnionFind(nodes);
    const mst = [];

    for(const edge of sortedEdge) {
        if ( !unionFind.isConnected(edge.getFrom().getId(), edge.getTo().getId()) ) {
            unionFind.union( edge.getFrom().getId(), edge.getTo().getId() )
            mst.push(edge)

            console.log(`添加边: ${edge.toString()}`);
        }

        // 如果最小生成树的边数等于节点数减一，则已经构建完成
        if (mst.length === nodes.length - 1) {
            break
        }
    }

    return mst
}