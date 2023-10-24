<script setup lang="ts">
import moment from "moment";

const route = useRoute();
const id = route.params.id;

const { data: sale } = (await useFetch(`/api/sales/${id}`)) as any;

definePageMeta({
  layout: false,
});
onMounted(async() => {
  window.onload = window.print() as any;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.addEventListener("focus", async() => {
      await navigateTo(`/sales/${id}/invoice/show`);
    });
  } else {
    await navigateTo(`/sales/${id}/invoice/show`);
  }
});
onBeforeMount(() => {
  document.body.style.backgroundColor = "white";
});
onBeforeUnmount(() => {
  document.body.style.backgroundColor = "";
});
</script>

<template>
  <div class="flex h-20">
    <div class="flex w-3/4">
      <div
        class="flex w-full text-3xl font-extrabold text-center text-main-primary brightness-75"
      >
        VERDUMARKET
      </div>
    </div>
    <div class="flex w-1/4">
      <div class="flex-row text-center">
        <div class="my-1 text-base font-black">No. {{ sale.invoice.id }}</div>
        <div>Fecha: {{ moment(sale.invoice.date).format("DD/MM/YYYY") }}</div>
      </div>
    </div>
  </div>
  <div
    class="flex items-center w-full px-4 text-sm border-2 border-black rounded-t-lg h-7"
  >
    <span class="font-bold">Nombre:</span>
    <span class="w-3/4 pl-3"> {{ sale.invoice.name }} </span>
    <span> </span>
    <span class="font-bold">Nit:</span>
    <span class="w-1/4 pl-3"> {{ sale.invoice.nit }} </span>
  </div>
  <div
    class="flex items-center w-full px-4 text-sm border-2 border-t-0 border-black rounded-b-lg h-7"
  >
    <span class="font-bold">Dirección: </span>
    <span class="w.4/5 pl-3">{{ sale.invoice.address }}</span>
  </div>
  <div class="relative mt-3 border-2 border-black rounded min-h-[5rem]">
    <ul
      class="flex justify-center items-center w-full h-5 border-y-[0.65rem] border-main-secondary text-center px-1 text-xs font-semibold"
    >
      <li class="w-1/12 text-center">Cantidad</li>
      <li class="w-7/12">Descripción</li>
      <li class="w-2/12">Precio Unidad</li>
      <li class="w-2/12">Precio Total</li>
    </ul>
    <table class="w-full text-xs">
      <tbody class="flex-row">
        <template v-for="(item, index) in sale.content" :key="index">
          <tr class="h-5">
            <td class="w-1/12 text-center">{{ item.quantity }}</td>
            <td class="w-7/12 px-2 text-xs">
              {{ item.name }}
            </td>
            <td class="w-2/12 text-center">
              {{ item.unitPrice.toFixed(2) }}
            </td>
            <td class="w-2/12 text-center">
              {{ (item.unitPrice * item.quantity).toFixed(2) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <div
    class="flex items-center justify-end w-full h-8 mt-3 border-[1rem] rounded-xl border-main-secondary"
  >
    <div class="text-sm font-bold">
      <span> Total: {{ (sale.total).toFixed(2) }}</span>
    </div>
  </div>
</template>