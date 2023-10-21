<script setup>

const emit = defineEmits(["close", "confirmed", "cancelled"])
const disableButtons = ref(false)

const props = defineProps(
    {
        show: Boolean,
        primaryText: { type: String, default: "¿Seguro que quieres continuar?" },
        secondaryText: {type: String, default: ""},
        confirmButtonText: {type: String, default: "Continuar"},
        cancelButtonText: {type: String, default: "Cancelar"},
        closeable: {type: Boolean, default: false}
    }
)



watch(
    () => props.show,
    () => {
        if(!props.show){
            emit("close")
        }
    }
)

</script>

<template>
    <Modal :show="show" :closeable="closeable" @close="show = false">
        <div class="flex flex-col items-center justify-center p-8">
            <i class="text-sky-600 pi pi-info-circle" style="font-size: 15vh;"></i>
            <p class="mt-4 text-3xl font-black text-center">
                {{ primaryText }}
            </p>
            <p class="mt-2 text-lg font-medium text-center" v-if="secondaryText">
                {{ secondaryText }}
            </p>
            <div class="flex w-full mt-8 space-x-4 md:max-w-sm">
                <button :disabled="disableButtons" @click="emit('cancelled'); show = false" class="flex items-center justify-center flex-1 px-4 py-3 font-bold text-white transition-colors bg-red-500 rounded-md hover:bg-red-600">{{cancelButtonText}}</button>
                <button :disabled="disableButtons" @click="emit('confirmed'); show = false" class="flex-1 px-4 py-3 text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600">{{confirmButtonText}}</button>
            </div>
        </div>
    </Modal>
</template>
