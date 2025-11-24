// eslint-disable-next-line no-unused-vars
import { stdEdge, stdNode, Validation } from "@/utils/std.js";

export class GraphUtils {

    /*********************************************
    |                                             |
    |                 节点相关函数                 |
    |                                             |
    **********************************************/

    /**
     * 通过 `id` 寻找节点在数组中的索引
     * @param {string} id 
     * @param {stdNode[]} nodes 
     * @return {number} 返回节点在数组中的索引，如果未找到则返回-1
     */
    static findNodeById(id, nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.getId() === id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 检验节点 `id` 是否有效
     * @param {string} id 节点ID
     * @param {stdNode[]} nodes 所有节点的数组
     * @return {Validation} 返回一个布尔值表示是否有效，以及错误信息
     */
    static validateNodeId(id) {
        if (!id || id.trim() === '') {
            return new Validation(false, '节点名称不能为空')
        }

        if (id.length > 1) {
            return new Validation(false, '节点名称长度不能超过1个字符')
        }

        return new Validation(true, '')
    }

    /**
     * 检查是否可以添加名称为 `id` 的新节点 
     * @param {string} id 
     * @param {stdNode[]} nodes 
     * @return {Validation} 返回一个布尔值表示是否有效，以及错误信息
     */ 
    static validateNewNode(id, nodes) {
        if ( nodes.length > 0 && this.findNodeById(id, nodes) !== -1 ) {
            return new Validation(false, '节点名称已存在，请使用其他名称')
        }

        return this.validateNodeId(id)
    }

    /**
     * 检查是否可以删除名称为 `id` 的节点
     * @param {string} id 
     * @param {stdNode[]} nodes 
     * @return {Validation} 返回一个布尔值表示是否有效，以及错误信息
     */
    static validateRemoveNode(id, nodes) {
        if (nodes.length === 0) {
            return new Validation(false, '图中没有节点，无法删除')
        }

        if ( this.findNodeById(id, nodes) === -1 ) {
            return new Validation(false, `节点 ${id} 不存在，无法删除`)
        }

        return this.validateNodeId(id)
    }


    /**********************************************
    |                                             |
    |                  边相关函数                  |
    |                                             | 
    **********************************************/

    /**
     * 根据边的两个端点查找边
     * @param {string} from 
     * @param {string} to 
     * @param {stdEdge[]} edges 
     * @returns {number} 返回边在数组中的索引，如果未找到则返回-1
     */
    static findEdgeByNodeIds(from, to, edges) {
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            if ((edge.getFrom().getId() === from && edge.getTo().getId() === to) ||
                (edge.getFrom().getId() === to && edge.getTo().getId() === from)) {
                return i
            }
        }
        return -1
    }

    /**
     * 检查边 `<from, to>: weight` 是否有效
     * @param {string} from 端点A
     * @param {string} to 端点B
     * @param {number} weight 边的权重
     * @param {stdNode[]} nodes 所有节点的数组
     * @return {Validation} 返回一个布尔值表示是否有效，以及错误信息 / 逗号分隔的，端点A,B索引组成的字符串
     */
    static validateEdge(from, to, weight, nodes) {
        // from !== to
        if (from === to) {
            return new Validation(false, '端点A和端点B不能相同')
        }

        // 检查端点A名称有效
        const validationFrom = this.validateNodeId(from);
        if ( !validationFrom.getIsValid() ) {
            validationFrom.setMsg( `端点A(${from})无效: ` + validationFrom.msg )
            return validationFrom;
        }

        // 检查端点A是否存在
        const fromIndex = this.findNodeById(from, nodes)
        if (fromIndex === -1) {
            return new Validation(false, `端点A (${from}) 不存在`)
        }

        // 检查端点B名称有效
        const validationTo = this.validateNodeId(to);
        if ( !validationTo.getIsValid() ) {
            validationTo.setMsg( `端点B(${to})无效: ` + validationTo.msg )
            return validationTo;
        }

        // 检查端点B是否存在
        const toIndex = this.findNodeById(to, nodes)
        if (toIndex === -1) {
            return new Validation(false, `端点B (${to}) 不存在`)
        }

        // 检查权重是否为正数
        if (weight <= 0) {
            return new Validation(false, '边的权重必须是正数')
        }
        
        return new Validation(true, `${fromIndex} ${toIndex}`)
    }

    /**
     * 检查是否可以添加新边 `<from, to>: weight`
     * @param {string} from 端点A
     * @param {string} to 端点B
     * @param {string} weight 权重
     * @param {stdNode[]} nodes 
     * @param {stdNode[]} edges 
     * @returns {Validation} 返回一个布尔值表示是否有效，以及错误信息 / 逗号分隔的，端点A,B索引组成的字符串
     */
    static validateNewEdge(from, to, weight, nodes, edges) {
        // 检查边是否已存在
        if (edges.length > 0 && this.findEdgeByNodeIds(from, to, edges) !== -1) {
            return new Validation(false, `边 <${from}, ${to}> 已存在`)
        }

        return this.validateEdge(from, to, weight, nodes)
    }

    /**
     * 检查是否可以删除边 `<from, to>`
     * @param {string} from 
     * @param {string} to 
     * @param {stdNode[]} nodes 
     * @param {stdEdge[]} edges 
     * @return {Validation} 返回一个布尔值表示是否有效，以及错误信息 / 边在数组中的索引
     */
    static validateRemoveEdge(from, to, nodes, edges) {
        if (edges.length === 0) {
            return new Validation(false, '图中没有边，无法删除')
        }

        // 检查边是否存在
        const edgeIndex = this.findEdgeByNodeIds(from, to, edges)
        if (edgeIndex === -1) {
            return new Validation(false, `边 <${from}, ${to}> 不存在`)
        }

        const validation = this.validateEdge(from, to, 1, nodes)
        validation.setMsg( edgeIndex.toString() )
        return validation
    }
    

    /**********************************************
    |                                             |
    |                 画图相关函数                 |
    |                                             | 
    **********************************************/

    /**
     * 重新计算每个结点的 (x,y) 坐标
     * @param {stdNode[]} nodes 所有结点的数组
     * @param {number} width canvas 宽度
     * @param {number} height canvas 高度
     */
    static recalculateNodePositions(nodes, width, height) {
        if (nodes.length === 0) return;
        if (nodes.length === 1) {
            nodes[0].setX(width / 2);
            nodes[0].setY(height / 2);
            return;
        }
        const r = 200;  // 正多边形半径
        const centerX = width / 2;
        const centerY = height / 2;
        const angleIncrement = (2 * Math.PI) / nodes.length;
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]; 
            const angle = i * angleIncrement;
            node.setX( centerX + r * Math.cos(angle) )
            node.setY( centerY + r * Math.sin(angle) )
        }
    }

    /**
     * 画节点
     * @param {CanvasRenderingContext2D} ctx 
     * @param {stdNode} node 
     * @param {string} circleColor 圆圈颜色
     * @param {string} textColor 文字颜色
     * @returns {void}
     */
    static drawNode(ctx, node, circleColor = '#1abc9c', textColor = '#ffffff') {
        // 画圆
        ctx.beginPath()
        ctx.arc(node.getX(), node.getY(), 
            20, 0, 2 * Math.PI)
        ctx.fillStyle = circleColor
        ctx.fill()

        // 画文字
        ctx.fillStyle = textColor
        ctx.font = 'bold 14px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText(node.getId(), node.getX(), node.getY() + 5)
        console.log(`绘制节点: ${node.toString()}`)
    }

    /**
     * 画边（不包括两个端点）
     * @param {CanvasRenderingContext2D} ctx 
     * @param {stdEdge} edge 
     * @param {string} lineColor 
     * @param {number} lineWidth 
     * @param {string} textColor 
     */
    static drawEdge(ctx, edge, lineColor = '#2c3e50', lineWidth = 1, textColor = '#000000') {
        // 画线
        ctx.beginPath()
        ctx.moveTo(edge.getFrom().getX(), edge.getFrom().getY())
        ctx.lineTo(edge.getTo().getX(), edge.getTo().getY())
        ctx.strokeStyle = lineColor
        ctx.lineWidth = lineWidth
        ctx.stroke()

        // 绘制权重
        const midX = (2*edge.getFrom().getX() + edge.getTo().getX()) / 3
        const midY = (2*edge.getFrom().getY() + edge.getTo().getY()) / 3
        ctx.fillStyle = textColor
        ctx.font = 'bold 12px JetBrains Mono'
        ctx.textAlign = 'center'
        ctx.fillText(edge.weight.toString(), midX, midY - 5)

        console.log(`绘制边: ${edge.toString()}`)
    }


    /**
     * 全部重画
     * @param {CanvasRenderingContext2D} ctx 
     * @param {stdNode[]} nodes 
     * @param {stdEdge[]} edges 
     * @param {number} width 
     * @param {number} height 
     */
    static redrawAllDefault(ctx, nodes, edges, width, height) {
        // 清空画布
        ctx.clearRect(0, 0, width, height)
        
        // 重新计算节点位置
        this.recalculateNodePositions(nodes, width, height)
        
        // 画所有边和节点
        for (const edge of edges) {
            this.drawEdge(ctx, edge, '#2c3e50', 1, '#000000')
        }

        for (const node of nodes) {
            this.drawNode(ctx, node, '#1abc9c', '#ffffff')
        }
    }
    
}