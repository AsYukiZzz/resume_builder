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

    <!-- 遍历渲染所有模块，严格按照 schema 顺序 -->
    <template v-for="mod in schema" :key="mod.id">
      <!-- 技能模块特殊处理 -->
      <div
        v-if="moduleStates[mod.id] && mod.id === 'skill'"
        class="mb-6"
      >
        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
          {{ mod.name }}
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(item, idx) in data[mod.id]"
            :key="idx"
            class="bg-gray-50 border border-gray-100 px-2 py-1 rounded text-sm text-gray-700"
            :style="{ fontSize: styleConfig.fontSize + 'px' }"
          >
            <span class="font-medium">{{ item.name }}</span>
            <span v-if="item.level" class="text-gray-400 ml-1 text-xs">{{ item.level }}</span>
          </div>
        </div>
      </div>

      <!-- 其他通用列表模块 -->
      <div
        v-else-if="moduleStates[mod.id] && mod.id !== 'profile'"
        class="mb-8"
      >
        <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
          {{ mod.name }}
        </div>
        
        <div class="space-y-6">
          <div v-for="(item, idx) in data[mod.id]"
 :key="idx" class="relative pl-4 border-l border-gray-100">
            <div class="absolute -left-[3px] top-2 w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            
            <div class="flex justify-between items-baseline mb-1">
              <span
                class="font-bold text-gray-900"
                :style="{ fontSize: Number(styleConfig.fontSize) + 1 + 'px' }"
              >
                {{ item.school || item.company || item.name }}
              </span>
              <span class="text-xs text-gray-400 font-mono">{{ item.date }}</span>
            </div>
            
            <div class="text-gray-600 mb-2 font-medium text-sm flex items-center gap-2">
              <span>{{ item.role || item.major }}</span>
              <span v-if="item.degree" class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span v-if="item.degree">{{ item.degree }}</span>
            </div>

            <!-- 直接渲染 HTML -->
            <div
              v-if="item.desc"
              class="text-gray-600 leading-relaxed prose-content"
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
