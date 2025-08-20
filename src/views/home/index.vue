<template>
  <div class="app-container">
    <el-card class="index-card">
      <el-row type="flex" justify="space-between" :gutter="10" class="panel-group">
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                用户数
              </div>
              <div class="card-panel-text">
                {{ item.user }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-case">
              <svg-icon icon-class="case" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                场景数
              </div>
              <div class="card-panel-text">
                {{ item.case }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-project">
              <svg-icon icon-class="project" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                项目数
              </div>
              <div class="card-panel-text">
                {{ item.project }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-group">
              <svg-icon icon-class="group" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                业务数
              </div>
              <div class="card-panel-text">
                {{ item.group }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-success">
              <svg-icon icon-class="success" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                成功率
              </div>
              <div class="card-panel-text">
                {{ item.success_rate }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-call">
              <svg-icon icon-class="call" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                调用量
              </div>
              <div class="card-panel-text">
                {{ item.log }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :lg="3" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-efficiency">
              <svg-icon icon-class="efficiency" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                节省时间
              </div>
              <div class="card-panel-text">
                {{ timeSavingData.department_summary ? timeSavingData.department_summary.total_saved_time : '0秒' }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="panel-group">
        <el-col :span="8">
          <div>
            <el-card class="box-card" :body-style="{ padding: '10px' }" shadow="hover">
              <div slot="header" class="clearfix">
                <span>执行状态分布</span>
              </div>
              <div class="chart-wrapper">
                <div id="run" style="width:100% ;height:250px;" />
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-card class="box-card" :body-style="{ padding: '10px' }" shadow="hover">
              <div slot="header" class="clearfix">
                <span>调用方式分布</span>
              </div>
              <div class="chart-wrapper">
                <div id="call" style="width:100% ;height:250px;" />
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-card class="box-card" :body-style="{ padding: '10px' }" shadow="hover">
              <div slot="header" class="clearfix">
                <span>业务线分布</span>
              </div>
              <div class="chart-wrapper">
                <div id="group" style="width:100% ;height:250px;" />
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="panel-group">
        <el-col :span="24">
          <div>
            <el-card class="box-card" :body-style="{ padding: '10px' }" shadow="hover">
              <div slot="header" class="clearfix">
                <span>最近7天场景趋势图</span>
              </div>
              <div class="chart-wrapper">
                <div id="seven" style="width:100% ;height:300px;" />
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" class="panel-group">
        <el-col :span="24">
          <el-card class="box-card" :body-style="{ padding: '10px' }" shadow="hover">
            <div slot="header" class="clearfix">
              <span>时间节省统计</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="refreshTimeSaving">刷新</el-button>
            </div>

            <!-- 顶部关键指标卡片 -->
            <div class="ts-metrics">
              <el-card shadow="never" class="metric-card">
                <div class="metric-label">部门总节省时间</div>
                <div class="metric-value primary">{{ timeSavingData.department_summary ? timeSavingData.department_summary.total_saved_time : '-' }}</div>
              </el-card>
              <el-card shadow="never" class="metric-card">
                <div class="metric-label">效率提升</div>
                <div class="metric-value">{{ timeSavingData.department_summary ? timeSavingData.department_summary.efficiency_rate : '-' }}</div>
              </el-card>
              <el-card shadow="never" class="metric-card">
                <div class="metric-label">手动执行时间</div>
                <div class="metric-value">{{ timeSavingData.department_summary ? timeSavingData.department_summary.total_manual_time : '-' }}</div>
              </el-card>
              <el-card shadow="never" class="metric-card">
                <div class="metric-label">自动执行时间</div>
                <div class="metric-value">{{ timeSavingData.department_summary ? timeSavingData.department_summary.total_auto_time : '-' }}</div>
              </el-card>
              <el-card shadow="never" class="metric-card">
                <div class="metric-label">成功执行次数</div>
                <div class="metric-value">{{ timeSavingData.department_summary ? timeSavingData.department_summary.total_success_count : '-' }}</div>
              </el-card>
            </div>
            
            <!-- 业务线统计和场景排行 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <h4 style="margin-bottom: 15px; color: #303133;">业务线节省时间排行</h4>
                <el-table :data="timeSavingData.business_lines || []" size="small" style="width: 100%">
                  <el-table-column prop="group_name" label="业务线" min-width="120" />
                  <el-table-column prop="saved_time" label="节省时间" min-width="120">
                    <template slot-scope="scope">
                      <el-tag size="small" type="success">{{ scope.row.saved_time }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="success_count" label="成功次数" min-width="120" />
                  <el-table-column prop="total_executions" label="总次数" min-width="120" />
                </el-table>
              </el-col>
              <el-col :span="12">
                <h4 style="margin-bottom: 15px; color: #303133;">场景节省时间排行</h4>
                <el-table :data="timeSavingData.top_cases || []" size="small" style="width: 100%">
                  <el-table-column prop="title" label="场景名称" min-width="220" :show-overflow-tooltip="true" />
                  <el-table-column prop="group_name" label="业务线" min-width="120" />
                  <el-table-column prop="saved_time" label="节省时间" min-width="120">
                    <template slot-scope="scope">
                      <el-tag size="small" type="success">{{ scope.row.saved_time }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="success_count" label="成功次数" min-width="120" />
                </el-table>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>

</template>

<script>
import { statistics, timeSavingStatistics } from '@/api/data'
import * as echarts from 'echarts'
// const echarts = require('echarts/lib/echarts')
// require('echarts/lib/component/title')
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/legend')
// require('echarts/lib/chart/pie')
// require('echarts/lib/chart/line')

export default {
  name: 'Dashboard',
  components: {},
  props: {},
  data() {
    return {
      call_count: [],
      case_count: [],
      success_count: [],
      exception_count: [],
      error_count: [],
      week_data: [],
      group: [],
      call: [],
      run: [],
      timeSavingData: {
        department_summary: null,
        business_lines: [],
        top_cases: []
      },
      item: {
        user: 0,
        project: 0,
        case: 0,
        group: 0,
        log: 0,
        success: 0,
        success_rate: '0%',
        exception: 0,
        error: 0,
        internal: 0,
        out: 0,
        rpc: 0,
        weekly_data: [],
        group_data: [],
        call_type_data: [],
        run_type_data: []
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getDataStatistics()
    this.getTimeSavingStatistics()
  },
  methods: {
    getRunPie(run, run_type_data) {
      // 绘制图表
      var myChart = echarts.init(document.getElementById('run'))
      // 指定图表的配置项和数据
      var option = {
        // 标题
        title: {
          // text: '执行状态分布',
          x: 'left' // 标题位置
          // textStyle: { //标题内容的样式
          //   color: '#000',
          //   fontStyle: 'normal',
          //   fontWeight: 100,
          //   fontSize: 16 //主题文字字体大小，默认为18px
          // },
        },
        stillShowZeroSum: true,
        // 鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        // 图例
        legend: { // 图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 10, // 控制图例出现的距离  默认左上角
          left: 'center', // 控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: { // 图例中文字的样式
            color: '#000',
            fontSize: 16
          },
          data: run// 图例上显示的饼图各模块上的名字
        },
        // 饼图中各模块的颜色
        color: ['#67c23a', '#f56c6c', '#e6a23c'],
        // 饼图数据
        series: {
          name: '执行状态',
          type: 'pie', // echarts图的类型   pie代表饼图
          radius: ['40%', '60%'], // 饼图中饼状部分的大小所占整个父元素的百分比
          center: ['50%', '50%'], // 整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: run_type_data,
          itemStyle: {
            normal: {
              label: {
                show: true// 饼图上是否出现标注文字 标注各模块代表什么  默认是true
                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true// 官网demo里外部标注上的小细线的显示隐藏    默认显示
              }
            }
          }
        }

      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    getCallPie(call, call_type_data) {
      // 绘制图表
      var myChart = echarts.init(document.getElementById('call'))
      // 指定图表的配置项和数据
      var option = {
        // 标题
        title: {
          // text: '调用方式分布',
          x: 'left' // 标题位置
          // textStyle: { //标题内容的样式
          //   color: '#000',
          //   fontStyle: 'normal',
          //   fontWeight: 100,
          //   fontSize: 16 //主题文字字体大小，默认为18px
          // },
        },
        stillShowZeroSum: true,
        // 鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        // 图例
        legend: { // 图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 10, // 控制图例出现的距离  默认左上角
          left: 'center', // 控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: { // 图例中文字的样式
            color: '#000',
            fontSize: 16
          },
          data: call// 图例上显示的饼图各模块上的名字
        },
        // 饼图中各模块的颜色
        color: ['#5ab1ef', '#32dadd', '#32DD57FF'],
        // 饼图数据
        series: {
          name: '调用方式',
          type: 'pie', // echarts图的类型   pie代表饼图
          radius: ['40%', '60%'], // 饼图中饼状部分的大小所占整个父元素的百分比
          center: ['50%', '50%'], // 整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: call_type_data,
          itemStyle: {
            normal: {
              label: {
                show: true// 饼图上是否出现标注文字 标注各模块代表什么  默认是true
                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true// 官网demo里外部标注上的小细线的显示隐藏    默认显示
              }
            }
          }
        }

      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    getGroupPie(group, group_data) {
      // 绘制图表
      var myChart = echarts.init(document.getElementById('group'))
      // 指定图表的配置项和数据
      var option = {
        // 标题
        title: {
          // text: '调用方式分布',
          x: 'left' // 标题位置
          // textStyle: { //标题内容的样式
          //   color: '#000',
          //   fontStyle: 'normal',
          //   fontWeight: 100,
          //   fontSize: 16 //主题文字字体大小，默认为18px
          // },
        },
        stillShowZeroSum: true,
        // 鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        // 图例
        legend: { // 图例  标注各种颜色代表的模块
          // orient: 'vertical',//图例的显示方式  默认横向显示
          bottom: 10, // 控制图例出现的距离  默认左上角
          left: 'center', // 控制图例的位置
          // itemWidth: 16,//图例颜色块的宽度和高度
          // itemHeight: 12,
          textStyle: { // 图例中文字的样式
            color: '#000',
            fontSize: 16
          },
          data: group// 图例上显示的饼图各模块上的名字
        },
        // // 饼图中各模块的颜色
        // color: ['#5ab1ef', '#32dadd'],
        // 饼图数据
        series: {
          name: '业务线',
          type: 'pie', // echarts图的类型   pie代表饼图
          radius: ['40%', '60%'], // 饼图中饼状部分的大小所占整个父元素的百分比
          center: ['50%', '50%'], // 整个饼图在整个父元素中的位置
          // data:''               //饼图数据
          data: group_data,
          itemStyle: {
            normal: {
              label: {
                show: true// 饼图上是否出现标注文字 标注各模块代表什么  默认是true
                // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
              },
              labelLine: {
                show: true// 官网demo里外部标注上的小细线的显示隐藏    默认显示
              }
            }
          }
        }

      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    getSevenLine(call_count, case_count, week_data, success_count, exception_count, error_count) {
      // 绘制图表
      var myChart = echarts.init(document.getElementById('seven'))
      // 指定图表的配置项和数据
      var option = {
        // 折线图标志
        legend: {
          data: ['最近7天场景调用量', '最近7天场景创建量', '最近7天场景成功数', '最近7天场景异常数', '最近7天场景失败数']
        },
        xAxis: {
          type: 'category', // 还有其他的type，可以去官网看看哦
          data: week_data, // x轴数据
          // name: '日期', // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 16
          }
        },
        yAxis: {
          type: 'value',
          // name: '纵轴名称', // y轴名称
          // y轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 16
          }
        },
        label: {},
        tooltip: {
          trigger: 'axis' // axis   item   none三个值
        },
        series: [
          {
            name: '最近7天场景调用量',
            data: call_count,
            type: 'line'
          },
          {
            name: '最近7天场景创建量',
            data: case_count,
            type: 'line'
          },
          {
            name: '最近7天场景成功数',
            data: success_count,
            type: 'line'
          },
          {
            name: '最近7天场景异常数',
            data: exception_count,
            type: 'line'
          },
          {
            name: '最近7天场景失败数',
            data: error_count,
            type: 'line'
          }
        ]

      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    async getDataStatistics() {
      // eslint-disable-next-line no-empty
      try {
        this.loading = this.$loading({
          lock: true,
          text: '数据加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0,0,0,0.7)'
        })
        const { data } = await statistics()
        this.item = data
        this.item.weekly_data.forEach((i) => {
          this.call_count.push(i['call_count'])
          this.case_count.push(i['case_count'])
          this.success_count.push(i['success_count'])
          this.exception_count.push(i['exception_count'])
          this.error_count.push(i['error_count'])
          this.week_data.push(i['date'])
        })
        this.item.group_data.forEach((i) => {
          this.group.push(i['name'])
        })
        this.item.call_type_data.forEach((i) => {
          this.call.push(i['name'])
        })
        this.item.run_type_data.forEach((i) => {
          this.run.push(i['name'])
        })
        this.getRunPie(this.run, this.item.run_type_data)
        this.getCallPie(this.call, this.item.call_type_data)
        this.getGroupPie(this.group, this.item.group_data)
        this.getSevenLine(this.call_count, this.case_count, this.week_data, this.success_count, this.exception_count, this.error_count)
        this.loading.close()
      } catch (err) {
        this.loading.close()
        console.log(err)
      }
    },
    async getTimeSavingStatistics() {
      try {
        const { data } = await timeSavingStatistics()
        this.timeSavingData = data
      } catch (err) {
        console.log('获取时间节省统计失败:', err)
      }
    },
    refreshTimeSaving() {
      this.getTimeSavingStatistics()
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    /* 7等分平铺 */
    flex: 0 0 calc(14.2857% - 10px);
    max-width: calc(14.2857% - 10px);
  }
  .card-panel {
    height: 90px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-case {
        background: #36a3f7;
      }

      .icon-project {
        background: #265DF6;
      }

      .icon-success {
        background: #34bfa3
      }
      .icon-group {
        background: #34bfa3
      }
      .icon-call {
        background: #8abf34
      }
      .icon-group {
        background: #bf34bd
      }
      .icon-efficiency {
        background: #E6A23C;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-case {
      color: #36a3f7;
    }

    .icon-project {
      color: #265DF6;
    }

    .icon-success {
      color: #34bfa3
    }
    .icon-group {
      background: #fff
    }
    .icon-call {
      background: #fff
    }
    .icon-efficiency {
      color: #E6A23C;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 14px 14px 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 30px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 26px 26px 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  .chart-wrapper {
    background: #fff;
    //padding: 16px 16px 0;
    margin-bottom: 32px;
    //box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    //border-color: rgba(0, 0, 0, .05);
  }
}
.ts-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;

  .metric-card {
    flex: 1 1 200px;
    min-width: 200px;
    padding: 8px 12px;
    .metric-label {
      color: #909399;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .metric-value {
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      &.primary {
        color: #67C23A;
        font-size: 22px;
      }
    }
  }
}
/* 取消半列固定，固定为两行展示 */
.index-card {
  border-radius: 10px;
}
@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
