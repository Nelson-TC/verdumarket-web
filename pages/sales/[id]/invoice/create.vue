<script setup lang="ts">
import { useToast } from "vue-toastification";

const route = useRoute();
const id = route.params.id;

const toast = useToast();

const { data: sale } = (await useFetch(`/api/sales/${id}`)) as any;

const storeInvoiceForm = ref({
  name: "",
  address: "",
  nit: ""
});

const storeInvoice = async (printInvoice: boolean) => {
  await $fetch(`/api/sales/${id}/invoice/store`, {
    method: "POST",
    body: { ...storeInvoiceForm.value },
  }).then(async(result) => {
    if (result.id && printInvoice) {
      await navigateTo(`/sales/${id}/invoice/print`);
    } else {
      toast.success("Factura creada con éxito");
      await navigateTo(`/sales/${id}/invoice/show`);
    }
  });
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div
      class="grid grid-cols-3 p-2 mt-2 bg-white rounded-lg shadow gap-x-4 gap-y-2"
    >
      <div class="col-span-2">
        <label class="custom-label-resizable" for="name">Nombre:</label>
        <input
          id="name"
          type="text"
          class="w-full custom-input-resizable"
          v-model="storeInvoiceForm.name"
          autocomplete="off"
        />
      </div>
      <div class="col-span-1">
        <label class="custom-label-resizable" for="nit">NIT:</label>
        <input
          id="nit"
          type="text"
          class="w-full custom-input-resizable"
          v-model="storeInvoiceForm.nit"
          autocomplete="off"
        />
      </div>
      <div class="col-span-3">
        <label class="custom-label-resizable" for="address">Dirección:</label>
        <input
          id="address"
          type="text"
          class="w-full custom-input-resizable"
          v-model="storeInvoiceForm.address"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="mt-4 overflow-auto rounded-lg max-h-[20rem]">
      <table class="w-full text-xs md:text-sm">
        <thead class="sticky top-0 z-30 h-8 bg-neutral-200">
          <tr>
            <th class="w-20 py-1">Cant.</th>
            <th class="py-1">Descripción</th>
            <th class="w-32 py-1">P.U</th>
            <th class="w-32 py-1">P.T</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="item in sale.content" :key="item.id">
            <td class="py-2 text-center">{{ item.quantity }}</td>
            <td class="w-7/12 py-2">{{ item.name }}</td>
            <td class="px-2 py-2 text-center">{{ item.unitPrice }}</td>
            <td class="px-2 py-2 text-center">
              {{ (item.unitPrice * item.quantity).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="flex justify-end p-2 mt-2 text-sm font-semibold bg-white rounded-lg shadow md:text-base text-neutral-800"
    >
      Total: Q.{{ (sale.total).toFixed(2) }}
    </div>
    <div class="flex items-center justify-around mt-4 space-x-4">
      <button
        class="w-full py-2 text-sm font-bold transition rounded-lg md:text-lg bg-main-primary hover:brightness-90"
        @click="storeInvoice(false)"
      >
        Crear
      </button>
      <button
        class="w-full py-2 text-sm font-bold transition rounded-lg md:text-lg bg-main-primary hover:brightness-90"
        @click="storeInvoice(true)"
      >
        Crear e imprimir
      </button>
    </div>
  </div>
</template>
