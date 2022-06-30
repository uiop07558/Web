<template>
  <ul>
    <li>
      <div class="list-tags-access">
        <span
          v-if="project.children?.length"
          class="svg-control-tree"
          @click.stop="onCollapseProject(project.uid)"
        >
          <span v-if="isOpen(project.uid)">
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.77011 6.87133C4.40803 7.4288 3.59197 7.42879 3.22989 6.87133L0.149702 2.12908C-0.247103 1.51816 0.191341 0.71057 0.919818 0.71057L7.08018 0.71057C7.80866 0.71057 8.2471 1.51816 7.8503 2.12908L4.77011 6.87133Z"
                fill="#222222"
              />
            </svg>
          </span>
          <span v-else>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.87133 3.22989C7.4288 3.59197 7.42879 4.40803 6.87133 4.77011L2.12908 7.8503C1.51816 8.2471 0.71057 7.80866 0.71057 7.08018V0.919817C0.71057 0.191341 1.51816 -0.247102 2.12908 0.149703L6.87133 3.22989Z"
                fill="black"
                fill-opacity="0.5"
              />
            </svg>
          </span>
        </span>
        <span
          v-else
          class="svg-control-tree"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.87133 3.22989C7.4288 3.59197 7.42879 4.40803 6.87133 4.77011L2.12908 7.8503C1.51816 8.2471 0.71057 7.80866 0.71057 7.08018V0.919817C0.71057 0.191341 1.51816 -0.247102 2.12908 0.149703L6.87133 3.22989Z"
              fill="black"
              fill-opacity="0.0"
            />
          </svg>
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 90 81"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="project.color !== '#A998B6'"
            d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
            :fill="project.color"
            fill-opacity="1"
          />
          <path
            v-else
            d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
        <input
          :id="`project-check-button-${project.uid}`"
          :checked="isCheckedProject(project.uid)"
          type="checkbox"
          class="check-custom-empployee custom-checkbox"
          @click="onCheckProject(project.uid)"
        >

        <label
          class="break-words"
          :for="`project-check-button-${project.uid}`"
        >
          <span class="max-w-[250px] truncate ... mr-[20px]">
            {{ project.name }}
          </span>
        </label>
      </div>
      <template
        v-if="isOpen(project.uid) && project.children?.length"
      >
        <TaskPropsButtonProjectItem
          v-for="child in project.children"
          :key="child.uid"
          class="item-child"
          :check-project="checkProject"
          :collapsed-project="collapsedProject"
          :project="child"
          @collapseProject="onCollapseProject"
          @checkProject="onCheckProject"
        />
      </template>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TaskPropsButtonProjectItem', // necessary for self-reference
  props: {
    checkProject: {
      type: String,
      default: '00000000-0000-0000-0000-000000000000'
    },
    collapsedProject: {
      type: Array,
      default: () => []
    },
    project: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['checkProject', 'collapseProject'],
  methods: {
    isCheckedProject (projectUid) {
      return this.checkProject === projectUid
    },
    isOpen (projectUid) {
      const index = this.collapsedProject.findIndex(
        (uid) => uid === projectUid
      )
      return index === -1
    },
    onCheckProject (projectUid) {
      this.$emit('checkProject', projectUid)
    },
    onCollapseProject (projectUid) {
      this.$emit('collapseProject', projectUid)
    }
  }
}
</script>

<style scoped>

</style>
