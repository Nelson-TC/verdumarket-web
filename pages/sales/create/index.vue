<script setup lang="ts">
import { useToast } from "vue-toastification";

const toast = useToast();

const filter = ref();
const search_query = ref("");

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const {
  data: products,
  refresh,
  pending,
} = await useFetch("/api/products/search", {
  headers,
  query: {
    search_query,
    limit: 12,
  },
});

let searchTimeout: any;
const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => (search_query.value = filter.value), 250);
};
watch(
  () => filter.value,
  () => debounceSearch()
);

const getAvailableStock = (item: any) => {
  const foundedItem: { quantity: number } = saleItems.value.find(
    (i: any) => i.id === item.id
  ) as any;
  if (foundedItem) {
    return item.stock - foundedItem.quantity;
  } else {
    return item.stock;
  }
};

const saleItems: any = ref([]);

const addSaleItem = (item: any, qtyToAdd: number = 1) => {
  const existsInSaleItems = saleItems.value.some((i: any) => i.id === item.id);
  const fixedItem = JSON.parse(
    JSON.stringify({
      id: item.id,
      name: item.name,
      unitPrice: item.unitPrice,
      stock: item.stock,
    })
  );

  if (getAvailableStock(item) >= qtyToAdd) {
    if (existsInSaleItems) {
      increaseSaleItemQty(fixedItem, qtyToAdd);
    } else {
      fixedItem.quantity = qtyToAdd;
      saleItems.value.push(fixedItem as any);
    }
  } else {
    toast.error("No hay cantidad suficiente");
  }
};

const increaseSaleItemQty = (increaseItem: any, qtyToIncrease: number = 1) => {
  const item = saleItems.value.find((i: any) => i.id === increaseItem.id);
  if (!(getAvailableStock(item) >= qtyToIncrease)) {
    toast.error("Cantidad máxima");
  } else {
    item.quantity += qtyToIncrease;
  }
};

const decreaseSaleItemQty = (decreaseItem: any) => {
  const item = saleItems.value.find((i: any) => i.id === decreaseItem.id);
  if (item.quantity >= 2) {
    item.quantity -= 1;
  }
};

const deleteSaleItem = (item: any) => {
  const indexItem = saleItems.value.indexOf(item);
  saleItems.value.splice(indexItem, 1);
};

const subtotal = computed(() =>
  saleItems.value
    .reduce((sum: any, item: any) => {
      return sum + item.quantity * item.unitPrice;
    }, 0)
    .toFixed(2)
);

const showConfirmSaleModal = ref(false);

const openConfirmSaleModal = () => {
  showConfirmSaleModal.value = true;
};

const showConfirmInvoiceModal = ref(false);

const openConfirmInvoiceModal = () => {
  setTimeout(() => {
    showConfirmInvoiceModal.value = true;
  }, 100);
};

const storeSaleForm = ref({
  content: null,
  createInvoice: false,
});

const resetStoreSaleForm = () => {
  storeSaleForm.value = {
    content: null,
    createInvoice: false,
  };
  saleItems.value = [];
};

const storeSale = async (createInvoice: boolean) => {
  storeSaleForm.value.content = saleItems.value;
  storeSaleForm.value.createInvoice = createInvoice;
  await $fetch("/api/sales", {
    method: "POST",
    body: { ...storeSaleForm.value },
  }).then(async(result) => {
    if (storeSaleForm.value.createInvoice && result.id) {
      await navigateTo(`/sales/${result.id}/invoice/create`);
    }
    resetStoreSaleForm();
    refresh();
    toast.success("Venta creada con éxito");
  });
};
</script>

<template>
  <ConfirmModal
    primary-text="¿Seguro que quieres continuar con la venta?"
    :show="showConfirmSaleModal"
    @cancelled="showConfirmSaleModal = false"
    @close="showConfirmSaleModal = false"
    @confirmed="openConfirmInvoiceModal"
  />
  <ConfirmModal
    confirm-button-text="Si hacer comprobante"
    cancel-button-text="NO hacer comprobante"
    primary-text="¿Quieres crear un comprobante para la venta?"
    :show="showConfirmInvoiceModal"
    @close="showConfirmInvoiceModal = false"
    @confirmed="storeSale(true)"
    @cancelled="storeSale(false)"
  />
  <div
    class="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 h-[88vh]"
  >
    <div
      class="flex flex-col justify-start w-full h-full p-4 bg-white rounded-lg shadow select-none"
    >
      <div class="flex w-full">
        <input
          id="filterInput"
          ref="filterInput"
          :value="filter"
          @input="(e) => (filter = e.target.value)"
          type="text"
          class="w-full custom-input"
          placeholder="Buscar producto"
          autocomplete="off"
        />
      </div>
      <div class="overflow-hidden max-h-[100%]">
        <!-- Table Results -->
        <table
          class="w-full mt-4 text-xs font-semibold md:text-sm text-neutral-600"
          v-if="products.length"
        >
          <thead>
            <tr>
              <th class="pl-2 text-left">Nombre</th>
              <th>Precio</th>
              <th>Disponible</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product.id"
              @click="addSaleItem(product)"
              class="transition-colors cursor-pointer odd:bg-neutral-200 hover:bg-main-secondary hover:text-black"
            >
              <td class="px-2 py-2.5 md:py-3">{{ product.name }}</td>
              <td class="px-2 py-2.5 md:py-3 text-center">
                {{ product.unitPrice }}
              </td>
              <td class="px-2 py-2.5 md:py-3 text-center">
                {{ product.stock }}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <p
          v-else
          class="p-8 text-xl font-extrabold text-center text-neutral-600"
        >
          No se encontraron resultados
        </p>
      </div>
    </div>
    <div class="w-full p-4 bg-white rounded-lg shadow">
      <div v-if="saleItems.length">
        <p class="mb-4 font-bold text-center md:text-xl">Previsualización</p>
        <!-- Sale Items -->
        <div class="max-h-[65vh] overflow-y-scroll">
          <table class="w-full text-xs lg:text-sm">
            <thead class="sticky top-0 z-10 bg-white">
              <tr>
                <th class="w-10 md:w-20">Cant.</th>
                <th class="pl-2 text-left">Nombre</th>
                <th>Precio</th>
                <th class="w-8 md:w-12"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in saleItems"
                :key="item.id"
                class="odd:bg-neutral-200"
              >
                <td class="w-10 py-2 md:w-20 md:py-0">
                  <div
                    class="flex flex-col-reverse items-center justify-center md:flex-row"
                  >
                    <button
                      class="px-1.5 py-0.5 md:px-2 md:py-1 transition hover:brightness-90 rounded bg-main-primary"
                      @click="decreaseSaleItemQty(item)"
                    >
                      <i
                        class="pi pi-minus !text-[0.5rem]"
                        style="font-weight: bolder"
                      ></i>
                    </button>
                    <p class="px-2">
                      {{ item.quantity }}
                    </p>
                    <button
                      class="px-1.5 py-0.5 md:px-2 md:py-1 transition hover:brightness-90 rounded bg-main-primary"
                      @click="increaseSaleItemQty(item)"
                    >
                      <i
                        class="pi pi-plus !text-[0.5rem]"
                        style="font-weight: bolder"
                      ></i>
                    </button>
                  </div>
                </td>
                <td class="p-2">
                  {{ item.name }}
                  <template v-for="detail in item.details" :key="detail.name">
                    <p
                      v-if="
                        detail.printable &&
                        (!detail.optional ||
                          (detail.optional && detail.include)) &&
                        detail.value
                      "
                    >
                      <span class="font-medium capitalize">{{
                        detail.name
                      }}</span
                      >: {{ detail.value }}
                    </p>
                  </template>
                </td>
                <td class="p-2">
                  <div class="flex flex-col text-center">
                    <span>
                      {{ (item.unitPrice * item.quantity).toFixed(2) }}
                    </span>
                    <span class="text-[0.60rem] lg:text-xs">
                      {{ item.unitPrice }} x {{ item.quantity }}
                    </span>
                  </div>
                </td>
                <td class="relative w-8 md:w-12">
                  <button
                    @click="deleteSaleItem(data)"
                    class="px-1.5 py-1 text-xs font-semibold text-red-100 transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <i class="h-full pi pi-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-center">
          <span class="font-semibold">Subtotal: </span
          ><span class="font-medium">{{ subtotal }}</span>
        </p>
        <div class="max-w-xs px-8 mx-auto">
          <button
            @click="openConfirmSaleModal"
            class="w-full py-2.5 mt-4 font-semibold rounded-lg bg-main-primary hover:brightness-90 transition"
          >
            Continuar con la venta
          </button>
        </div>
      </div>
      <p
        class="flex items-center justify-center w-full h-full p-10 text-xl font-bold text-center select-none text-neutral-400"
        v-else
      >
        Aqui se verá la previsualización de la venta
      </p>
    </div>
  </div>
</template>
