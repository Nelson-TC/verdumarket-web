<script setup>
const emit = defineEmits(["clickClose"])

const props = defineProps({
    align: {
        type: String,
        default: 'right',
    },
    width: {
        type: String,
        default: '48',
    },
    contentClasses: {
        type: Array,
        default: () => ['py-1', 'bg-white'],
    },
});

let open = ref(false);

const closeOnEscape = (e) => {
    if (open.value && e.key === 'Escape') {
        open.value = false;
    }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

const widthClass = computed(() => {
    return {
        '48': 'w-40 md:w-48',
    }[props.width.toString()];
});

const alignmentClasses = computed(() => {
    if (props.align === 'left') {
        return 'origin-top-left left-0';
    }

    if (props.align === 'left-submenu') {
        return 'origin-top-right top-0 left-0 -translate-x-full -mt-2';
    }

    if (props.align === 'right') {
        return 'origin-top-right right-0';
    }

    return 'origin-top';
});

watch(
    () => open.value,
    () => {
        if (!open.value) {
            emit("clickClose")
        }
    }
)

</script>

<template>
    <div class="relative">
        <div @click="open = !open">
            <slot name="trigger" />
        </div>

        <!-- Full Screen Dropdown Overlay -->
        <div v-show="open" class="fixed inset-0 z-40" @click="open = false" />

        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <div v-show="open" class="absolute z-50 mt-2 rounded-md shadow-lg" :class="[widthClass, alignmentClasses]"
                style="display: none;">
                <div class="rounded-md ring-1 ring-black ring-opacity-5" :class="contentClasses">
                    <div class="block px-4 py-2 text-xs text-gray-400 pointer-events-none">
                        <slot name="title" />
                    </div>
                    <div @click="open = false" >
                        <slot name="content" />
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
