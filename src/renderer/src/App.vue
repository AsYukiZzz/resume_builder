<template>
  <div
    :key="rootKey"
    class="h-screen w-screen flex flex-col bg-slate-50 text-slate-700 font-sans overflow-hidden dark:bg-slate-950 dark:text-slate-200"
  >
    <ToastContainer />
    <!-- Header -->
    <header
      class="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 z-40 relative select-none print:hidden shadow-sm transition-colors duration-300 dark:bg-slate-900/80 dark:border-slate-800"
      style="-webkit-app-region: drag"
    >
      <div class="flex items-center" style="-webkit-app-region: no-drag">
        <div class="w-9 h-9 flex items-center justify-center text-indigo-600 bg-indigo-50 rounded-xl dark:bg-slate-800 dark:text-indigo-400">
          <FileText :size="20" stroke-width="2.5" />
        </div>
      </div>

      <div class="flex items-center gap-4" style="-webkit-app-region: no-drag">
        <button
          @click="toggleTheme"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all"
          :title="isDark ? '切换亮色模式' : '切换暗色模式'"
        >
          <Sun v-if="isDark" :size="20" />
          <Moon v-else :size="20" />
        </button>

        <button
          @click="handleReset"
          class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="重置所有数据"
        >
          <RotateCcw :size="16" /> <span>重置</span>
        </button>

        <button
          @click="loadProject"
          class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-all dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
        >
          <FolderOpen :size="16" /> <span>打开</span>
        </button>

        <div class="relative" ref="exportMenuRef">
          <button
            @click="isExportMenuOpen = !isExportMenuOpen"
            class="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <Download :size="14" stroke-width="2.5" /> <span>导出简历</span>
            <ChevronDown :size="12" :class="{ 'rotate-180': isExportMenuOpen }" />
          </button>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isExportMenuOpen"
              class="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 ring-1 ring-black/5 dark:bg-slate-900/95 dark:border-slate-800 dark:ring-white/5"
            >
              <button
                @click="handleExport('pdf')"
                :disabled="isExporting"
                class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <FileText :size="16" class="text-red-500" /> <span>导出 PDF 文档</span>
                <Loader2 v-if="isExporting" class="animate-spin ml-auto" :size="14" />
              </button>
              <button
                @click="handleExport('png')"
                :disabled="isExporting"
                class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Image :size="16" class="text-green-500" /> <span>导出 PNG 图片</span>
              </button>
              <div class="h-px bg-slate-100 my-1 mx-2 dark:bg-slate-800"></div>
              <button
                @click="saveProject"
                class="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Save :size="16" class="text-blue-500" /> <span>保存工程文件</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- 1. 左侧导航 -->
      <aside
        class="bg-white border-r border-slate-100 flex flex-col shrink-0 transition-all duration-300 z-30 relative print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800"
        :class="isCollapsed ? 'w-16' : 'w-60'"
      >
        <div
          class="h-16 flex items-center shrink-0 border-b border-slate-50 dark:border-slate-800"
          :class="isCollapsed ? 'justify-center' : 'justify-between px-4'"
        >
          <span
            v-show="!isCollapsed"
            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate"
            >模块管理</span
          >
          <button
            @click="isCollapsed = !isCollapsed"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          >
            <PanelLeftClose v-if="!isCollapsed" :size="16" /><PanelLeftOpen v-else :size="18" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar py-3 px-2">
          <draggable
            v-model="activeSchema"
            item-key="id"
            handle=".drag-handle"
            animation="200"
            ghost-class="bg-indigo-50/80 dark:bg-indigo-900/50"
          >
            <template #item="{ element: mod }">
              <div
                @click="handleModuleClick(mod.id)"
                class="flex items-center py-3 mb-1.5 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden"
                :class="[
                  currentTab === mod.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm ring-1 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                  isCollapsed ? 'justify-center px-0 mx-1' : 'px-3'
                ]"
              >
                <GripVertical
                  v-show="!isCollapsed"
                  :size="14"
                  class="drag-handle mr-2 text-slate-300 hover:text-slate-500 cursor-move dark:text-slate-500 dark:hover:text-slate-300"
                />
                <component :is="mod.icon" :size="isCollapsed ? 20 : 18" class="shrink-0 transition-transform duration-200 group-hover:scale-105" />
                <span v-show="!isCollapsed" class="ml-2.5 text-xs font-medium truncate flex-1">{{
                  mod.name
                }}</span>
                <input
                  v-show="!isCollapsed"
                  type="checkbox"
                  v-model="moduleStates[mod.id]"
                  class="w-4 h-4 rounded-md border-slate-300 accent-indigo-600 cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-indigo-600"
                />
              </div>
            </template>
          </draggable>
        </div>
        <div class="p-3 border-t border-slate-50 flex justify-center dark:border-slate-800">
          <button
            @click="isEditorOpen = !isEditorOpen"
            class="w-full py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
            :class="
              isEditorOpen ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300'
            "
          >
            <PanelRightClose v-if="isEditorOpen" :size="18" />
            <span v-if="!isCollapsed && !isEditorOpen" class="text-xs font-medium">展开编辑器</span>
            <PanelRightOpen v-else-if="!isEditorOpen" :size="18" />
          </button>
        </div>
      </aside>

      <!-- 2. 中间编辑器 -->
      <main
        class="shrink-0 border-r border-slate-100 bg-white flex flex-col relative z-20 transition-all duration-500 overflow-hidden print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:bg-slate-900 dark:border-slate-800"
        :class="isEditorOpen ? 'w-[640px]' : 'w-16'"
      >
        <div v-if="isEditorOpen" class="h-full flex flex-col min-w-[640px]">
          <div
            class="h-16 border-b border-slate-50 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-800"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400"
              >
                <component :is="currentModule?.icon" :size="20" />
              </div>
              <h2 class="text-lg font-bold text-slate-800 tracking-tight dark:text-slate-200">{{ currentModule?.name }}</h2>
            </div>
            <button
              @click="isEditorOpen = false"
              class="text-slate-400 hover:text-indigo-600 transition p-2 hover:bg-slate-50 rounded-lg dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            >
              <PanelRightClose :size="20" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
            <Transition
              mode="out-in"
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-x-4"
              enter-to-class="opacity-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-x-0"
              leave-to-class="opacity-0 -translate-x-4"
            >
              <div v-if="currentModule" :key="currentModule.id" class="space-y-8 pb-24">
                <ProfileEditor
                  v-if="currentModule.id === 'profile'"
                  :modelValue="resumeData.profile"
                />
                <UniversityEditor
                  v-else-if="currentModule.id === 'university'"
                  :modelValue="resumeData.university"
                />
                <EducationEditor
                  v-else-if="currentModule.id === 'education'"
                  :list="resumeData.education"
                />
                <WorkEditor v-else-if="currentModule.id === 'work'" :list="resumeData.work" />
                <ProjectEditor
                  v-else-if="currentModule.id === 'project'"
                  :list="resumeData.project"
                />
                <ResearchEditor
                  v-else-if="currentModule.id === 'research'"
                  :list="resumeData.research"
                />
                <OtherEditor v-else-if="currentModule.id === 'other'" :list="resumeData.other" />
                <PortfolioEditor
                  v-else-if="currentModule.id === 'portfolio'"
                  :list="resumeData.portfolio"
                />
                <AwardEditor v-else-if="currentModule.id === 'award'" :list="resumeData.award" />
                <SkillEditor v-else-if="currentModule.id === 'skill'" :list="resumeData.skill" />
                <ListEditor
                  v-else
                  :list="resumeData[currentModule.id]"
                  :fields="currentModule.fields"
                  :moduleName="currentModule.name"
                />
              </div>
            </Transition>
          </div>
        </div>
        <div
          v-else
          class="h-full w-full flex flex-col items-center py-4 bg-white cursor-pointer group dark:bg-slate-900"
          @click="isEditorOpen = true"
        >
          <button class="p-2 rounded-lg bg-indigo-50 text-indigo-600 mb-6 dark:bg-indigo-900/30 dark:text-indigo-400">
            <PanelRightOpen :size="18" />
          </button>
          <div class="mb-4 text-gray-400 group-hover:text-indigo-500 transition-colors dark:text-slate-600 dark:group-hover:text-indigo-400">
            <component :is="currentModule?.icon" :size="20" />
          </div>
          <div
            class="text-xs font-bold text-gray-400 group-hover:text-indigo-600 tracking-[0.3em] vertical-text select-none uppercase dark:text-slate-600 dark:group-hover:text-indigo-400"
          >
            {{ currentModule?.name }}
          </div>
        </div>
      </main>

      <!-- 3. 右侧预览区 -->
      <aside
        ref="previewContainer"
        @wheel="handleScroll"
        class="flex-1 bg-slate-100/50 flex flex-col min-w-0 relative overflow-hidden print:hidden dark:bg-slate-950 transition-colors duration-300"
      >
        <!-- 上方工具栏：模板选择 + 排版设置 -->
        <div
          class="bg-white/60 backdrop-blur-2xl border-b border-slate-200/50 px-4 py-1.5 flex flex-wrap items-center shrink-0 z-30 gap-3 transition-all dark:bg-slate-900/60 dark:border-slate-800"
        >
          <!-- 1. 模板选择卡片 -->
          <div
            class="flex items-center gap-3 p-1.5 rounded-xl bg-indigo-50/40 border border-indigo-200/50 shadow-[0_2px_8px_-2px_rgba(99,102,241,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(99,102,241,0.15)] hover:bg-indigo-50/80 hover:border-indigo-300/60 transition-all group dark:bg-indigo-900/20 dark:border-indigo-800/30 dark:hover:bg-indigo-900/40 dark:hover:border-indigo-700/50"
          >
            <div
              class="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-1 group-hover:text-indigo-600 transition-colors shrink-0 dark:text-indigo-400 dark:group-hover:text-indigo-300"
            >
              <LayoutTemplate :size="14" />
              <span class="hidden xl:inline">模板</span>
            </div>
            <div class="h-4 w-px bg-slate-200/80 dark:bg-slate-700/50"></div>
            <div class="flex items-center gap-2">
              <CustomSelect
                v-model="currentTemplateName"
                :options="templateOptions"
                label="模板"
                class="w-36"
              />
              <button
                @click="handleImportTemplate"
                class="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                title="导入模板"
              >
                <Upload :size="14" />
              </button>
            </div>
          </div>

          <!-- 2. 排版设置卡片 -->
          <div
            class="flex items-center gap-3 p-1.5 rounded-xl bg-emerald-50/40 border border-emerald-200/50 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.1)] hover:shadow-[0_4px_12px_-2px_rgba(16,185,129,0.15)] hover:bg-emerald-50/80 hover:border-emerald-300/60 transition-all group dark:bg-emerald-900/20 dark:border-emerald-800/30 dark:hover:bg-emerald-900/40 dark:hover:border-emerald-700/50"
          >
            <div
              class="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-1 group-hover:text-emerald-600 transition-colors shrink-0 dark:text-emerald-400 dark:group-hover:text-emerald-300"
            >
              <Type :size="14" />
              <span class="hidden xl:inline">排版</span>
            </div>
            <div class="h-4 w-px bg-slate-200/80 dark:bg-slate-700/50"></div>
            <div class="flex items-center gap-2 flex-wrap">
              <CustomSelect
                v-model="styleConfig.fontFamily"
                :options="fontOptions"
                label="字体"
                class="w-32"
              />
              <CustomSelect
                v-model="styleConfig.fontSize"
                :options="fontSizeOptions"
                suffix="px"
                label="字号"
                class="w-28"
              />
              <CustomSelect
                v-model="styleConfig.lineHeight"
                :options="lineHeightOptions"
                suffix="倍"
                label="行距"
                class="w-28"
              />
            </div>
          </div>
        </div>

        <div
          class="flex-1 overflow-auto flex justify-center p-12 custom-scrollbar relative bg-slate-100/50 dark:bg-slate-950 transition-colors duration-300"
        >
          <!-- 模拟物理纸张的容器 -->
          <div
            id="screen-preview"
            class="shrink-0 origin-top transition-transform duration-300 relative flex flex-col gap-[20px]"
            :style="{
              width: '210mm',
              transform: `scale(${currentScale / 100})`,
              marginBottom: `-${(1 - currentScale / 100) * 297}mm`
            }"
          >
            <!-- 渲染层：直接渲染内容，不再使用复杂的 clip 方案 -->
            <div class="relative bg-white shadow-2xl min-h-[1123px] group text-slate-900">
              <!-- 内容本体 -->
              <div ref="contentRef" class="w-[210mm] bg-white min-h-[1123px] text-slate-900">
                <component
                  v-if="currentTemplateName && templates[currentTemplateName]"
                  :is="templates[currentTemplateName]"
                  :data="resumeData"
                  :schema="activeSchema"
                  :module-states="moduleStates"
                  :style-config="styleConfig"
                />
              </div>

              <!-- 分页辅助线：覆盖在内容上方 -->
              <div class="absolute inset-0 pointer-events-none z-[100]">
                <!-- 总是显示分页线，至少显示第一页的结束位置 -->
                <!-- 使用 10px 的安全偏移量，确保在线上的内容绝对安全 -->
                <div
                  v-for="n in Math.max(totalPages, 1)"
                  :key="n"
                  class="absolute w-full left-0 flex items-center justify-center pointer-events-none"
                  :style="{ top: (n * 1123 - 10) + 'px' }"
                >
                  <!-- 分页线 -->
                  <div class="w-full border-t-2 border-dashed border-red-500 absolute opacity-60"></div>
                  <!-- 标签 -->
                  <span
                    class="bg-red-500 text-white text-[10px] px-3 py-0.5 rounded-full font-bold shadow-sm z-10 backdrop-blur-sm opacity-80"
                    >PAGE {{ n }} LIMIT</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 下方工具栏：视图缩放 (悬浮样式) -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div
            class="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl px-1.5 py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-wrap items-center justify-center gap-3 transition-all ring-1 ring-black/5 dark:bg-slate-900/90 dark:border-slate-800 dark:ring-white/10 dark:shadow-black/20"
          >
            <!-- 3. 视图缩放卡片 -->
            <div
              class="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-blue-50/50 border border-blue-100 shadow-sm hover:shadow-md hover:bg-blue-50 hover:border-blue-200 transition-all group min-w-[320px] dark:bg-blue-900/20 dark:border-blue-800/30 dark:hover:bg-blue-900/40 dark:hover:border-blue-700/50"
            >
            <div
              class="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest px-1 group-hover:text-blue-600 transition-colors shrink-0 dark:text-blue-400 dark:group-hover:text-blue-300"
            >
              <Monitor :size="14" />
              <span class="hidden xl:inline">缩放</span>
            </div>
            <div class="h-4 w-px bg-slate-200/80 dark:bg-slate-700/50"></div>
            <div class="flex items-center gap-2">
              <button
                @click="setScaleMode('fit-width')"
                class="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[10px] font-bold transition-all border shadow-sm"
                :class="
                  scaleMode === 'fit-width'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
                "
              >
                <Scan :size="14" />
                <span>适应宽度</span>
              </button>
              
              <button
                @click="setScaleMode('fit-page')"
                class="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-[10px] font-bold transition-all border shadow-sm"
                :class="
                  scaleMode === 'fit-page'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
                "
              >
                <Maximize :size="14" />
                <span>全页预览</span>
              </button>

              <div
                class="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-inner flex-1 h-7 dark:bg-slate-800 dark:border-slate-700"
              >
                <ZoomIn :size="14" class="text-slate-400 ml-1.5 shrink-0 dark:text-slate-500" />
                <input
                  type="range"
                  min="30"
                  max="150"
                  v-model.number="manualScale"
                  @input="setScaleMode('manual')"
                  class="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 dark:bg-slate-700"
                />
                <span class="text-[10px] font-mono font-bold text-slate-400 min-w-[3ch] text-right mr-1.5 dark:text-slate-500">{{ currentScale }}%</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
    <div id="print-mount-point" class="hidden print:block"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import draggable from 'vuedraggable'
import ToastContainer from './components/ui/ToastContainer.vue'
import {
  GripVerticalIcon as GripVertical,
  PanelLeftCloseIcon as PanelLeftClose,
  PanelLeftOpenIcon as PanelLeftOpen,
  UploadIcon as Upload,
  FileTextIcon as FileText,
  ChevronDownIcon as ChevronDown,
  DownloadIcon as Download,
  Loader2Icon as Loader2,
  SaveIcon as Save,
  FolderOpenIcon as FolderOpen,
  ImageIcon as Image,
  PanelRightCloseIcon as PanelRightClose,
  PanelRightOpenIcon as PanelRightOpen,
  LayoutTemplateIcon as LayoutTemplate,
  TypeIcon as Type,
  MonitorIcon as Monitor,
  ScanIcon as Scan,
  MaximizeIcon as Maximize,
  ZoomInIcon as ZoomIn,
  MoonIcon as Moon,
  SunIcon as Sun,
  RotateCcwIcon as RotateCcw
} from 'lucide-vue-next'

// --- Composables ---
// 核心数据管理：简历数据、模块状态、Schema
import { useData } from './composables/useData'
// 布局管理：侧边栏折叠、编辑器展开等 UI 状态
import { useLayout } from './composables/useLayout'
// 导出功能：PDF 和 PNG 导出逻辑
import { useExport } from './composables/useExport'
// 工程文件管理：保存和加载 .json 格式的工程文件
import { useProjectFile } from './composables/useProjectFile'
// 模板与样式管理：切换模板、字体、间距等全局样式
import { useTemplate } from './composables/useTemplate'
// 主题管理：暗色/亮色模式切换
import { useTheme } from './composables/useTheme'
// 全局消息提示
import { useToast } from './composables/useToast'
// 缩放管理：预览区域的缩放逻辑
import { useScale } from './composables/useScale'

// --- Editors 组件 ---
import ProfileEditor from './components/editors/ProfileEditor.vue'
import UniversityEditor from './components/editors/UniversityEditor.vue'
import EducationEditor from './components/editors/EducationEditor.vue'
import WorkEditor from './components/editors/WorkEditor.vue'
import ProjectEditor from './components/editors/ProjectEditor.vue'
import ResearchEditor from './components/editors/ResearchEditor.vue'
import OtherEditor from './components/editors/OtherEditor.vue'
import AwardEditor from './components/editors/AwardEditor.vue'
import PortfolioEditor from './components/editors/PortFolioEditor.vue'
import SkillEditor from './components/editors/SkillEditor.vue'
import ListEditor from './components/editors/ListEditor.vue'
import CustomSelect from './components/ui/CustomSelect.vue'

// --- 初始化主题 ---
const { isDark, toggleTheme, initTheme } = useTheme()
const toast = useToast()

onMounted(() => {
  initTheme()
})

// --- Refs (DOM 引用与 UI 状态) ---
const rootKey = ref(0) // 用于强制刷新根组件的 key
const contentRef = ref<HTMLElement | null>(null) // 简历内容区域的 DOM 引用，用于导出
const previewContainer = ref<HTMLElement | null>(null) // 预览容器 DOM 引用，用于缩放计算
const exportMenuRef = ref<HTMLElement | null>(null) // 导出菜单 DOM 引用，用于点击外部关闭
const isExportMenuOpen = ref(false) // 导出菜单开关状态

// --- Logic Integration ---

// 1. 数据层
const {
  resumeData,    // 响应式简历数据对象
  moduleStates,  // 模块开关状态
  activeSchema,  // 当前激活的模块列表（支持拖拽排序）
  currentTab,    // 当前选中的模块 ID
  currentModule, // 当前选中的模块配置对象
  resetResume    // 重置数据方法
} = useData()

// 处理重置操作
const handleReset = () => {
  if (confirm('确定要重置所有数据吗？此操作无法撤销。')) {
    resetResume()
    toast.success('已重置所有数据')
  }
}

// 2. 布局层
const { isCollapsed, isEditorOpen } = useLayout()

// 3. 模板与样式层
const {
  templates,           // 可用模板列表
  currentTemplateName, // 当前选中模板名称
  templateOptions,     // 下拉框选项
  handleImportTemplate,// 导入自定义模板方法
  styleConfig,         // 全局样式配置（字体、字号等）
  fontOptions,         // 字体选项
  fontSizeOptions,     // 字号选项
  lineHeightOptions    // 行高选项
} = useTemplate()

// 4. 缩放与视图层
const {
  scaleMode,          // 当前缩放模式 (manual/fit-width/fit-page)
  manualScale,        // 手动缩放比例数值
  currentScale,       // 当前实际缩放比例
  totalPages,         // 计算出的总页数
  setScaleMode,       // 设置缩放模式方法
  handleScroll        // 处理滚轮缩放事件
} = useScale(previewContainer, contentRef)

// 5. 导出功能
const { isExporting, handleExport: exportHandler } = useExport()
const handleExport = (type: 'pdf' | 'png') => {
  exportHandler(type, contentRef.value)
  isExportMenuOpen.value = false
}

// 6. 工程文件管理
const { saveProject, loadProject } = useProjectFile(
  resumeData,
  styleConfig,
  activeSchema,
  currentTemplateName,
  rootKey,
  moduleStates
)

// --- Event Handlers ---

/**
 * 处理侧边栏模块点击
 * @param moduleId 点击的模块ID
 */
const handleModuleClick = (moduleId: string) => {
  if (currentTab.value === moduleId) {
    // 如果点击的是当前模块，则切换编辑器的展开/折叠状态 (类似 VS Code)
    isEditorOpen.value = !isEditorOpen.value
  } else {
    // 如果点击的是其他模块，则切换模块并强制展开编辑器
    currentTab.value = moduleId
    isEditorOpen.value = true
  }
}

/**
 * 处理点击外部关闭导出菜单
 */
const handleClickOutside = (e: MouseEvent): void => {
  if (exportMenuRef.value && !exportMenuRef.value.contains(e.target as Node)) {
    isExportMenuOpen.value = false
  }
}

// 注册全局事件监听
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
/* 保持所有样式不变，只修改逻辑 */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 视觉分页 */
.page-break-lines {
  background-image: linear-gradient(
    to bottom,
    white 0px,
    white 1123px,
    #cbd5e1 1123px,
    #e2e8f0 1124px,
    #e2e8f0 1143px,
    #cbd5e1 1143px,
    white 1144px
  );
  background-size: 100% 1144px;
}

/* 核心修复：打印专用样式 */
@media print {
  body > div#app {
    display: none !important;
  }
  #print-mount-point {
    display: block !important;
  }
  @page {
    size: A4;
    margin: 0;
  }
  .break-inside-avoid {
    break-inside: avoid;
  }
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
