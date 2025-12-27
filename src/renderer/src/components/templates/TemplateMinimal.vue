<template>
  <div
    class="h-full w-full bg-white text-slate-800 p-10"
    :style="{ fontFamily: styleConfig.fontFamily }"
  >
    <!-- 头部：居中极简风格 -->
    <div v-if="moduleStates['profile']" class="text-center mb-12">
      <h1
        class="font-light tracking-wide mb-4 text-slate-900"
        :style="{ fontSize: Number(styleConfig.fontSize) + 20 + 'px' }"
      >
        {{ data.profile.name || 'Your Name' }}
      </h1>
      
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-500 text-sm tracking-wider uppercase mb-6">
        <span v-if="data.profile.phone">{{ data.profile.phone }}</span>
        <span v-if="data.profile.email">{{ data.profile.email }}</span>
        <span v-if="data.profile.city">{{ data.profile.city }}</span>
        <span v-if="data.profile.github">{{ data.profile.github }}</span>

        <!-- 更多信息循环渲染 -->
        <template v-for="field in extraFields" :key="field.key">
          <span v-if="data.profile[field.key]">
            {{ field.label ? field.label + ': ' : '' }}{{ data.profile[field.key] }}
          </span>
        </template>
      </div>

      <div
        v-if="data.profile.summary"
        class="max-w-2xl mx-auto text-slate-600 leading-relaxed prose-content text-justify"
        :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
        v-html="data.profile.summary"
      ></div>
    </div>

    <!-- 模块循环 -->
    <template v-for="mod in schema" :key="mod.id">
      <div v-if="moduleStates[mod.id] && mod.id !== 'profile'" class="mb-10 group">
        <!-- 标题：带短下划线 -->
        <div class="flex items-center gap-4 mb-6">
          <h3
            class="font-medium tracking-[0.2em] uppercase text-slate-900 shrink-0"
            :style="{ fontSize: Number(styleConfig.fontSize) + 2 + 'px' }"
          >
            {{ mod.name }}
          </h3>
          <div class="h-px bg-slate-200 flex-1 group-hover:bg-slate-300 transition-colors"></div>
        </div>

        <!-- 列表内容 -->
        <div class="space-y-6">
          <div v-for="(item, idx) in data[mod.id]" :key="idx" class="relative pl-2 border-l-2 border-transparent hover:border-slate-200 transition-colors">
            <div class="flex justify-between items-baseline mb-2">
              <div class="font-medium text-slate-800 text-lg">
                {{ item.school || item.company || item.name }}
              </div>
              <div class="text-sm text-slate-400 font-mono shrink-0">{{ item.date }}</div>
            </div>
            
            <div v-if="item.major || item.role" class="flex items-center gap-2 mb-2 text-slate-600 font-medium italic">
              <span>{{ item.major || item.role }}</span>
              <span v-if="item.degree" class="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span v-if="item.degree">{{ item.degree }}</span>
            </div>

            <div
              v-if="item.desc"
              class="text-slate-500 prose-content leading-relaxed"
              :style="{ fontSize: styleConfig.fontSize + 'px', lineHeight: styleConfig.lineHeight }"
              v-html="item.desc"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps(['data', 'schema', 'moduleStates', 'styleConfig'])

const extraFields = [
  { key: 'education', label: '学历' },
  { key: 'experience', label: '经验' },
  { key: 'age', label: '年龄' },
  { key: 'gender', label: '性别' },
  { key: 'status', label: '状态' },
  { key: 'salary', label: '期望' },
  { key: 'wechat', label: '微信' },
  { key: 'website', label: 'Web' },
  { key: 'marriage', label: '婚姻' },
  { key: 'politics', label: '政治' },
  { key: 'hometown', label: '籍贯' },
  { key: 'height', label: '身高' },
  { key: 'weight', label: '体重' }
]
</script>

<style scoped>
:deep(.prose-content ul) {
  list-style-type: square;
  padding-left: 1.2em;
  margin: 4px 0;
  color: #64748b; /* slate-500 */
}
:deep(.prose-content ol) {
  list-style-type: decimal;
  padding-left: 1.2em;
  margin: 4px 0;
  color: #64748b;
}
:deep(.prose-content p) {
  margin: 4px 0;
}
:deep(.prose-content strong) {
  font-weight: 600;
  color: #334155; /* slate-700 */
}
:deep(.prose-content a) {
  color: #475569;
  text-decoration: underline;
  text-decoration-color: #cbd5e1;
}
</style>
