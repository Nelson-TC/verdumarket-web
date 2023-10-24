<script setup lang="ts">
import moment from "moment";

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const { data: invoices, refresh } = useFetch("/api/invoices", {
  headers,
});

const mountLoaded = ref<Boolean>(false);
onMounted(() => {
  mountLoaded.value = true;
});

const showDeleteModal = ref(false);
const invoiceToDelete = ref({});

const openDeleteInvoiceModal = (invoice: any) => {
  invoiceToDelete.value = invoice;
  showDeleteModal.value = true;
};

const invoiceDestroyed = () => {
  refresh();
};

const showInvoice = async (invoice: any) => {
  const sale = (await $fetch(
    `/api/sales/search-by-invoice-id/${invoice.id}`
  )) as any;
  await navigateTo(`/sales/${sale.id}/invoice/show`);
};
</script>

<template>
  <DeleteModal
    :show="showDeleteModal"
    :record="invoiceToDelete"
    routeToDelete="/api/invoices"
    @close="showDeleteModal = false"
    @success="invoiceDestroyed"
    primaryText="¿Seguro que quieres eliminar esta factura?"
    secondaryText="Al eliminar esta factura, la venta a la cual hace referencia no tendrá factura válida"
  />
  <div class="p-2 bg-white rounded-lg shadow" v-if="mountLoaded">
    <DataTable class="text-sm md:text-base" :value="invoices">
      <template #header>
        <div class="flex items-center space-x-2">
          <h1 class="text-lg font-black md:text-xl">Listado de ventas</h1>
        </div>
      </template>
      <Column header="Código" field="id" />
      <Column header="Nombre" field="name" />
      <Column header="Nit" field="nit" />
      <Column header="Dirección" field="address" />
      <Column header="Fecha">
        <template #body="{ data }">
          {{ moment(data.date).format("DD/MM/YYYY hh:mm") }}
        </template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex w-full space-x-6 md:space-x-4">
            <button
              @click="showInvoice(data)"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-teal-600 rounded-lg hover:bg-teal-700"
            >
              <i class="h-full pi pi-eye"></i>
            </button>
            <button
              @click="openDeleteInvoiceModal(data)"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <i class="h-full pi pi-times"></i>
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <div class="flex items-center justify-center p-12" v-else>
    <div
      class="w-10 h-10 border-4 rounded-full border-t-neutral-500 border-l-neutral-500 border-r-neutral-500 border-b-neutral-100 animate-spin"
    ></div>
  </div>
</template>