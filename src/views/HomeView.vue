<template>
  <div class="main">
    <div class="controller">
      <div class="header">
        <h1 class="centered title"> 克鲁斯卡尔算法 </h1>
      </div>
      <div class="body">
        <!-- 控制面板 -->
        <div class=" control-panel">

          <!-- 节点控制 -->
          <div class="node-controller">
            <h3> 节点控制 </h3>
            <!-- 添加节点 -->
            <input type="text" placeholder="输入要添加的节点名称" maxlength="1" v-model="newNodeId" @keyup.enter="addNode"/>
            <button @click="addNode" :disabled="onDisplay"> 添加节点 </button>
            <br/>
            <!-- 删除节点 -->
            <input type="text" placeholder="输入要删除的节点名称" maxlength="1" v-model="nodeId2remove" @keyup.enter="removeNode"/>
            <button @click="removeNode" :disabled="onDisplay"> 删除节点 </button>  
          </div>

          <!-- 边控制 -->
          <div class="edge-controller">
            <h3> 边控制 </h3>
            <!-- 添加边 -->
            <input type="text"   placeholder="输入边的端点A" maxlength="1"  v-model="newEdgeFrom"   @keyup.enter="addEdge"/>
            <input type="text"   placeholder="输入边的端点B" maxlength="1"  v-model="newEdgeTo"     @keyup.enter="addEdge"/>
            <input type="number" placeholder="输入边的权重"  maxlength="32" v-model="newEdgeWeight" @keyup.enter="addEdge" min="1"/>
            <br/>
            <button @click="addEdge" :disabled="onDisplay"> 添加边 </button>
            <br/>
            <!-- 删除边 -->
            <input type="text"  placeholder="输入边的端点A" maxlength="1" v-model="edgeFrom2remove" @keyup.enter="removeEdge"/>
            <input type="text"  placeholder="输入边的端点B" maxlength="1" v-model="edgeTo2remove"   @keyup.enter="removeEdge"/>
            <br/>
            <button @click="removeEdge" :disabled="onDisplay"> 删除边 </button>
          </div>
          
          <!-- 演示控制 -->
          <div class="display-controller">
            <h3> 演示控制 </h3>
            <button @click="setDefault1" :disabled="onDisplay"> 默认无向图1 </button>
            <button @click="setDefault2" :disabled="onDisplay"> 默认无向图2 </button>
            <button @click="autoKruskal" :disabled="onDisplay"> 自动演示 </button>
            <button @click="reset" :disabled="onDisplay"> 重置 </button>
            <button @click="intoStepMode" :disabled="onDisplay"> 手动模式 </button>
            <div v-if="isStepMode" class="centered">
              <button @click="previousStep"> 上一步 </button><br/>
              <button @click="nextStep"> 下一步 </button><br/>
              <button @click="exitStepMode"> 退出 </button>
            </div> 
          </div>
        </div>
      </div>
    </div>

    <div class="display">
      <div class="body">
        <canvas ref="canvas" width="570px" height="570px"></canvas>
      </div>
    </div>

    <div class="info">
          <h2> 状态信息 </h2>
          <p>节点数量: {{ nodes.length }}</p>
          <p>边数量: {{ edges.length }}</p>
          <ul>
            <li v-for="edge of edges"
              :key="edge.getId()"
              :class="{ 'highlighted': isHighlighted(edge) }">
              {{ edge.getFrom().getId() }}-{{ edge.getTo().getId()}}, 权重: {{ edge.getWeight() }}
            </li>
          </ul>
          <p>当前步骤: {{ currentStep }}</p>
          <ol v-if="mst.length > 0">
            <li v-for="(edge, index) in mst" 
              :key="index"
              :class="{ 'highlighted': isHighlighted(edge) }">
              {{ edge.getFrom().getId() }}-{{ edge.getTo().getId()}}, 权重: {{ edge.getWeight() }}
            </li>
          </ol>
          <p>最小生成树/森林总权重: {{ totalWeight }}</p>
        </div>
  </div>
</template>

<script setup>
import { Kruskal } from '@/utils/algorithm.js';
import { GraphUtils } from '@/utils/GraphUtils.js';
// eslint-disable-next-line no-unused-vars
import { stdEdge, stdNode, Validation } from '@/utils/std.js';
import { onMounted, ref } from 'vue';

// 响应式数据
/**
 *  @type {import('vue').Ref<stdNode[]>} nodes
 */
const nodes = ref([])
/**
 * @type {import('vue').Ref<stdEdge[]>} edges
 */
const edges = ref([])
const currentStep = ref(0)
const totalWeight = ref(0)
const onDisplay = ref(false) 
const isStepMode = ref(false)
const mst = ref([]);  // 最小生成树，克鲁斯卡尔算法的结果

// 节点控制相关
const newNodeId = ref('');  //  新节点的名字
const nodeId2remove = ref('');  // 待删除的节点名字

// 边控制相关
const newEdgeFrom = ref('')
const newEdgeTo = ref('')
const newEdgeWeight = ref('')
const edgeFrom2remove = ref('')
const edgeTo2remove = ref('')

// Canvas相关
const canvas = ref(null)
let ctx = null;

/**
 * 检查输入参数是否有效，有效返回 `true`，无效返回 `false`，在控制台输出错误信息，并弹出提示
 * @param {number} itemIndex 0: 添加节点, 1: 删除节点, 2: 添加边, 3: 删除边
 * @return {Validation} 返回一个对象，包含 isValid 和 msg 属性
 */
const _checkValidation = (itemIndex) => {
  mst.value = []
  currentStep.value = 0
  totalWeight.value = 0
  let validation = null
  if (itemIndex === 0) 
    validation = GraphUtils.validateNewNode(newNodeId.value, nodes.value)
  else if (itemIndex === 1)
    validation = GraphUtils.validateRemoveNode(nodeId2remove.value, nodes.value)
  else if (itemIndex === 2)
    validation = GraphUtils.validateNewEdge(newEdgeFrom.value, newEdgeTo.value, newEdgeWeight.value, nodes.value, edges.value)
  else if (itemIndex === 3)
    validation = GraphUtils.validateRemoveEdge(edgeFrom2remove.value, edgeTo2remove.value, nodes.value, edges.value)

    
  if ( !validation.getIsValid() ) {
    console.error(validation.msg)
    alert(validation.msg)
    return validation
  }
  
  return validation  // 节点有效
}

const addNode = () => {
  if ( !_checkValidation(0).getIsValid() ) return

  // 节点有效，开始添加
  let node = new stdNode(newNodeId.value, 0, 0)
  nodes.value.push(node)
  console.log(`添加节点: ${newNodeId.value}`);

  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
  newNodeId.value = '';  // 清空输入框
};

const removeNode = () =>{
  if ( !_checkValidation(1).getIsValid() ) return

  // 通过过滤器删除节点
  nodes.value = nodes.value.filter(node => node.getId() !== nodeId2remove.value);
  console.log(`删除节点: ${nodeId2remove.value}`);
  // 删除与该节点相关的边
  for (const edge of edges.value) {
    if (edge.getFrom().getId() === nodeId2remove.value || edge.getTo().getId() === nodeId2remove.value) {
      console.log(`删除边: ${edge.getFrom().getId()} - ${edge.getTo().getId()}`);
      edges.value = edges.value.filter(e => e !== edge);  
    }
  }

  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
  nodeId2remove.value = '';  // 清空输入框
}

const addEdge = () => {
  const validation = _checkValidation(2);
  if ( !validation.getIsValid() ) return

  // 从 msg 中解析出节点索引
  const indexes = validation.getMsg().split(' ')
  const fromNode =  nodes.value[parseInt(indexes[0].trim())]
  const toNode =  nodes.value[parseInt(indexes[1].trim())]
  console.log(`获取到端点A:${fromNode}, 端点B:${toNode}`)

  const edge = new stdEdge(fromNode, toNode, newEdgeWeight.value)
  edges.value.push(edge)
  console.log(`添加边: ${fromNode.getId()} - ${toNode.getId()} 权重: ${newEdgeWeight.value}`)

  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
  
  // 重置输入框
  newEdgeFrom.value = '';
  newEdgeTo.value = '';
  newEdgeWeight.value = '';
};

const removeEdge = () => {
  const validation = _checkValidation(3);
  if ( !validation.getIsValid() ) return

  const removeIndex = parseInt(validation.getMsg())
  const removedEdge = edges.value.splice(removeIndex, 1);
  console.log(`删除边: ${removedEdge}`);

  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
  // 重置输入框
  edgeFrom2remove.value = '';
  edgeTo2remove.value = '';
};

const isHighlighted = (edge) => {
  for (let i = 0; i < currentStep.value; i++) {
    const mstEdge = mst.value[i];
    if (mstEdge.getId() === edge.getId()) {
      return true;  // 如果边在最小生成树中，则高亮显示
    }
  }
  return false;  // 否则不高亮显示
}

const sleep = (ms) => {
  return new Promise( (resolve, reject) => {
    console.log(`${ms/1000}秒后继续...`);
    setTimeout( ()=> {
      resolve();
      reject(new Error('延时操作被取消'));
    }, ms)
  });
}

const autoKruskal = async() => {
  mst.value = Kruskal(nodes.value, edges.value)
  if (mst.value.length === 0) return

  if(isStepMode.value) {
    alert('请先退出手动模式');
    return;
  }

  alert('开始克鲁斯卡尔算法演示');
  onDisplay.value = true;  

  for (let i = 0; i < mst.value.length; i++) {
    const edge = mst.value[i];
    console.log(`第${i+1}步: 添加边 ${edge.getFrom().getId()} - ${edge.getTo().getId()} 权重: ${edge.getWeight()}`);
    
    // 绘制边和节点
    GraphUtils.drawEdge(ctx, edge,'#e74c3c', 3, '#000000');
    GraphUtils.drawNode(ctx, edge.getFrom(), '#2c3e50', '#ffffff');
    GraphUtils.drawNode(ctx, edge.getTo(), '#2c3e50', '#ffffff');

    currentStep.value += 1;  // 更新当前步骤
    totalWeight.value += edge.getWeight();    
    // 等待一段时间
    await sleep(1000);
  }

  onDisplay.value = false;  // 演示结束，恢复控制面板
  alert('克鲁斯卡尔算法演示结束');
};

const reset = () => {
  newNodeId.value = '';
  nodeId2remove.value = '';
  newEdgeFrom.value = '';
  newEdgeTo.value = '';
  newEdgeWeight.value = '';
  edgeFrom2remove.value = '';
  edgeTo2remove.value = '';
  edges.value = [];
  nodes.value = [];
  currentStep.value = 0;
  totalWeight.value = 0;
  isStepMode.value = false;
  onDisplay.value = false;  // 恢复控制面板
  mst.value = [];  // 清空最小生成树
  console.log('重置所有数据');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);  // 清空画布
  }
}

const intoStepMode = () => {
  isStepMode.value = true;
  onDisplay.value = true;  // 禁用控制面板
  currentStep.value = 0;  // 重置当前步骤
  totalWeight.value = 0;  // 重置总权重
  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
  console.log('进入手动模式');
  mst.value = Kruskal(nodes.value, edges.value);  // 获取最小生成树
  if (mst.value.length === 0) {
    exitStepMode();  // 如果没有最小生成树，退出手动模式
    return;
  }
};

const previousStep = () => {
  console.log('执行上一步操作');
  if (currentStep.value <= 0){
    alert('已经是第一步了');
    return;
  }
    
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);
  const totalStep = currentStep.value
  currentStep.value = 0; 
  totalWeight.value = 0;  // 重置总权重
  // 重新绘制 Kruskal 算法已经选中的边，直到 currentStep
  for (let i = 1; i < totalStep; i++) {
    nextStep()
  }
  console.log(`回到第${currentStep.value+1}步`);  // 输出当前步骤
};

const nextStep = () => {
  console.log('执行下一步操作');
  if (currentStep.value >= mst.value.length) {
    alert('已经是最后一步了');
    return;
  }
  const edge = mst.value[currentStep.value];
  console.log(`第${currentStep.value+1}步: 添加边 ${edge.getFrom().getId()} - ${edge.getTo().getId()} 权重: ${edge.getWeight()}`);
    
  // 绘制边和节点
  GraphUtils.drawEdge(ctx, edge,'#e74c3c', 3, '#000000');
  GraphUtils.drawNode(ctx, edge.getFrom(), '#2c3e50', '#ffffff');
  GraphUtils.drawNode(ctx, edge.getTo(), '#2c3e50', '#ffffff');

  currentStep.value += 1;  // 更新当前步骤
  totalWeight.value += edge.getWeight();  
};

const exitStepMode = () => {
  isStepMode.value = false;
  onDisplay.value = false;  // 恢复控制面板
  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
  currentStep.value = 0;  // 重置当前步骤
  totalWeight.value = 0;  // 重置总权重
  mst.value = [];  // 清空最小生成树
  console.log('退出手动模式');
};

const setDefault1 = () => {
  reset()
  // 设置默认节点
  for (let i = 0; i < 10; i++) {
    const node = new stdNode(String.fromCharCode(65 + i), 0, 0);
    nodes.value.push(node);
  }
  // 添加一些默认边
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[1], 5));  // A - B [5]
  edges.value.push(new stdEdge(nodes.value[1], nodes.value[2], 6));  // B - C [6]
  edges.value.push(new stdEdge(nodes.value[2], nodes.value[3], 7));  // C - D [7]
  edges.value.push(new stdEdge(nodes.value[3], nodes.value[4], 8));  // D - E [8]
  edges.value.push(new stdEdge(nodes.value[4], nodes.value[5], 9));  // E - F [9]
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[2], 10)); // A - C [10]
  edges.value.push(new stdEdge(nodes.value[1], nodes.value[3], 11)); // B - D [11]
  edges.value.push(new stdEdge(nodes.value[3], nodes.value[5], 12)); // D - F [12]
  edges.value.push(new stdEdge(nodes.value[5], nodes.value[6], 4));  // F - G [4] (权重很小，会很早被选择)
  edges.value.push(new stdEdge(nodes.value[6], nodes.value[7], 13)); // G - H [13]
  edges.value.push(new stdEdge(nodes.value[7], nodes.value[8], 14)); // H - I [14]
  edges.value.push(new stdEdge(nodes.value[8], nodes.value[9], 15)); // I - J [15]
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[8], 18)); // A - I [18]
  edges.value.push(new stdEdge(nodes.value[6], nodes.value[9], 16)); // G - J [16]
  edges.value.push(new stdEdge(nodes.value[2], nodes.value[7], 17)); // C - H [17]

  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
}

const setDefault2 = () => {
  reset()
  // 设置默认节点
  for (let i = 0; i < 10; i++) {
    const node = new stdNode(String.fromCharCode(65 + i), 0, 0);
    nodes.value.push(node);
  }
  // 添加一些默认边
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[1], 15)); // A - B [15]
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[2], 10)); // A - C [10]
  edges.value.push(new stdEdge(nodes.value[1], nodes.value[2], 12)); // B - C [12]
  edges.value.push(new stdEdge(nodes.value[1], nodes.value[3], 9));  // B - D [9]
  edges.value.push(new stdEdge(nodes.value[2], nodes.value[3], 8));  // C - D [8]
  edges.value.push(new stdEdge(nodes.value[2], nodes.value[5], 18)); // C - F [18]
  edges.value.push(new stdEdge(nodes.value[3], nodes.value[6], 11)); // D - G [11]
  edges.value.push(new stdEdge(nodes.value[5], nodes.value[6], 7));  // F - G [7]
  edges.value.push(new stdEdge(nodes.value[3], nodes.value[4], 14)); // D - E [14]
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[5], 25)); // A - F [25] (长距离高权重)
  edges.value.push(new stdEdge(nodes.value[1], nodes.value[6], 13)); // B - G [13]
  edges.value.push(new stdEdge(nodes.value[4], nodes.value[6], 16)); // E - G [16]
  edges.value.push(new stdEdge(nodes.value[0], nodes.value[3], 20)); // A - D [20]

  edges.value.push(new stdEdge(nodes.value[7], nodes.value[8], 10)); // H - I [10]
  edges.value.push(new stdEdge(nodes.value[7], nodes.value[9], 8));  // H - J [8]
  edges.value.push(new stdEdge(nodes.value[8], nodes.value[9], 12)); // I - J [12]
  // 重绘所有节点和边
  GraphUtils.redrawAllDefault(ctx, nodes.value, edges.value, canvas.value.width, canvas.value.height);  // 重绘所有节点和边
}


onMounted( () => {
  canvas.value = document.querySelector('canvas');
  ctx = canvas.value.getContext('2d');
})
</script>

<style scoped>
/* 主盒子 */
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.controller, .display ,.info{
  width: 40%;
  height: auto;
  padding: 30px;
  margin: 4em;
  background-color: white;
  border-radius: 10px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.2),
    0 5px 15px rgba(0, 0, 0, 0.15);
    color:#000000
}

.display body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.highlighted {
  color: #e74c3c;
  font-weight: bolder;
}

.info {
  width: 20%;
  height: auto;
}
.centered {
  text-align: center;
  margin-bottom: 5px;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.control-panel input {
  width: 30%;
  height: 3em;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.control-panel button {
  width: 30%;
  height: 3em;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.control-panel button:hover {
  background: #2980b9;
}

.control-panel button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.node-controller input{
  width: 60%;
  margin: 10px 5px 10px 0;
}

.node-controller button {
  margin: 10px 0 10px 5px;
}

.edge-controller input {
  margin: 0 10px 0 0;
}

.edge-controller button {
  width: 100%;
  margin: 5px 0 20px 0px;
}

.display-controller button {
  width: 100%;
  margin: 5px 0;
} 

.display-controller div button {
  width: 50%;
}

canvas {
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>