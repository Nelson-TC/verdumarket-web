<script setup>
import { useToast } from "vue-toastification";

const toast = useToast();

const emit = defineEmits(["close", "success"]);
const disableButtons = ref(false);

const props = defineProps({
  show: Boolean,
  record: Object,
  routeToDelete: String,
  primaryText: { type: String, default: "¿Seguro que quieres eliminarlo?" },
  secondaryText: { type: String, default: "Esta acción es permanente" },
  successMessage: { type: String, default: "Eliminado con éxito" },
});

const deleteRecord = () => {
  disableButtons.value = true;
  $fetch(`${props.routeToDelete}/${props.record.id}`, {
    method: "DELETE",
  })
    .then(() => {
      toast.success(props.successMessage);
      emit("success");
      emit("close");
      disableButtons.value = false;
    })
    .catch((error) => {
      toast.error(error.message);

      disableButtons.value = false;
    });
};

watch(
  () => props.show,
  () => {
    if (!props.show) {
      emit("close");
    }
  }
);
</script>

<template>
  <Modal :show="show" :closeable="true" @close="show = false">
    <div class="flex flex-col items-center justify-center p-5">
      <i
        class="text-red-600 pi pi-exclamation-circle"
        style="font-size: 15vh"
      ></i>
      <p class="mt-4 text-3xl font-black text-center">
        {{ primaryText }}
      </p>
      <p class="mt-2 text-lg font-medium text-center">
        {{ secondaryText }}
      </p>
      <div class="flex w-full h-12 mt-8 space-x-4 md:max-w-sm">
        <button
          :disabled="disableButtons"
          class="flex-1 text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600"
          @click="show = false"
        >
          Cancelar
        </button>
        <button
          :disabled="disableButtons"
          @click="deleteRecord"
          class="flex items-center justify-center flex-1 font-bold text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
        >
          Continuar
        </button>
      </div>
    </div>
  </Modal>
</template>
