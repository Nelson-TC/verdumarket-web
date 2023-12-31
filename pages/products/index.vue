<script setup lang="ts">
import { PDFDocument, rgb } from "pdf-lib";
import ExcelJS from 'exceljs';
import { useToast } from "vue-toastification";
import { UnitMeasurements } from "../../interfaces/unitMeasurements";

const toast = useToast();

const { getSession } = useAuth();
const filter = ref("");
const search_query = ref("");

const headers = useRequestHeaders(["cookie"]) as HeadersInit;
const {
  data: products,
  refresh,
  pending,
} = (await useFetch("/api/products/search", {
  headers,
  query: {
    search_query,
  },
})) as any;

const { data: categories } = await useFetch("/api/categories", {
  headers,
});

const mountLoaded = ref<Boolean>(false);
onMounted(() => {
  mountLoaded.value = true;
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

const showDeleteModal = ref(false);
const productToDelete = ref({});

const openDeleteModal = (product: any) => {
  showDeleteModal.value = true;
  productToDelete.value = product;
};

const showModal = ref(false);
const modalMode = ref();

const createProductForm = ref({
  name: "",
  unitPrice: "",
  unitMeasurement: "",
  categoryId: "",
});

const resetCreateProductForm = () => {
  createProductForm.value = {
    name: "",
    unitPrice: "",
    unitMeasurement: "",
    categoryId: "",
  };
};

const editProductForm = ref({
  name: "",
  unitPrice: "",
  unitMeasurement: "",
  categoryId: "",
});

const productToEdit = ref({} as any);

const openCreateModal = () => {
  showModal.value = true;
  modalMode.value = "create";
};

const openEditModal = (product: any) => {
  productToEdit.value = JSON.parse(JSON.stringify(product));
  editProductForm.value = {
    name: productToEdit.value.name,
    unitPrice: productToEdit.value.unitPrice,
    unitMeasurement: productToEdit.value.unitMeasurement,
    categoryId: productToEdit.value.categoryId,
  } as any;
  showModal.value = true;
  modalMode.value = "edit";
};

const storeProduct = async () => {
  await $fetch("/api/products", {
    method: "POST",
    body: { ...createProductForm.value },
  }).then(() => {
    showModal.value = false;
    resetCreateProductForm();
    refresh();
    toast.success("Producto creado con éxito");
  });
};

const updateProduct = async () => {
  await $fetch(`/api/products/${productToEdit.value.id}`, {
    method: "PUT",
    body: { ...editProductForm.value },
  }).then(() => {
    showModal.value = false;
    refresh();
    toast.success("Producto actualizado con éxito");
  });
};

const productDestroyed = async () => {
  showModal.value = false;
  refresh();
};

const unitMeasurements = Object.values(UnitMeasurements);

const generatePDFReport = async () => {
  const pageSize = [612, 792];

  const pdfDoc = await PDFDocument.create();

  const tableData = [
    [
      "ID",
      "Nombre",
      "Precio Unitario",
      "Inventario",
      "Unidad de medida",
      "Categoría",
    ],
    ...products.value.map((product: any) => [
      product.id.toString(),
      product.name,
      product.unitPrice.toFixed(2),
      product.stock.toString(),
      product.unitMeasurement,
      product.category.name,
    ]),
  ];

  const rowsPerPage = 36;
  let currentPage = 0;

  while (currentPage * rowsPerPage < tableData.length) {
    const page = pdfDoc.addPage(pageSize as [number, number]);

    page.drawText("Informe de Productos (Página " + (currentPage + 1) + ")", {
      x: 50,
      y: pageSize[1] - 30,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const startRow = currentPage * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, tableData.length);

    const cordX: any = {
      0: 20,
      1: 20,
      2: 100,
      3: 90,
      4: 80,
      5: 80,
    };

    for (let i = 0; i < endRow - startRow; i++) {
      for (let j = 0; j < tableData[startRow + i].length; j++) {
        page.drawText(tableData[startRow + i][j], {
          x: 50 + j * cordX[j as number],
          y: pageSize[1] - 50 - i * 20,
          size: 8,
          color: rgb(0, 0, 0),
        });
      }
    }

    currentPage++;
  }

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "informe.pdf";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
};

const generateExcelReport = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Informe');

  // Define las columnas y agrega los encabezados
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre', key: 'name', width: 20 },
    { header: 'Precio Unitario', key: 'unitPrice', width: 15 },
    { header: 'Inventario', key: 'stock', width: 12 },
    { header: 'Unidad de medida', key: 'unitMeasurement', width: 15 },
    { header: 'Categoría', key: 'category', width: 20 },
  ];

  // Agrega los datos de productos
  products.value.forEach((product: any) => {
    worksheet.addRow({
      id: product.id,
      name: product.name,
      unitPrice: product.unitPrice.toFixed(2),
      stock: product.stock,
      unitMeasurement: product.unitMeasurement,
      category: product.category.name,
    });
  });

  // Crea un Blob con el contenido del archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Crea una URL de objeto para el Blob
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Crea un enlace de descarga y hace clic en él para descargar el Excel
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'informe.xlsx';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  // Libera los recursos del enlace
  window.URL.revokeObjectURL(url);
};
</script>

<template>
  <DeleteModal
    :show="showDeleteModal"
    :record="productToDelete"
    routeToDelete="/api/products"
    success-message="Producto eliminado con éxito"
    @close="showDeleteModal = false"
    @success="productDestroyed"
  />
  <Modal :show="showModal" @close="showModal = false" vertical-position="top">
    <form
      v-if="modalMode === 'create'"
      @submit.prevent="storeProduct"
      class="p-4"
    >
      <p class="text-lg font-semibold text-center text-neutral-600">
        Crear producto
      </p>
      <div class="flex flex-col mt-2">
        <label class="custom-label-input" for="name">Nombre</label>
        <input
          id="name"
          v-model="createProductForm.name"
          type="text"
          class="custom-input"
          placeholder="Ingresar nombre"
          autocomplete="off"
        />
      </div>
      <div class="flex flex-col mt-4">
        <label class="custom-label-input" for="unitPrice"
          >Precio (por unidad)</label
        >
        <input
          id="unitPrice"
          v-model="createProductForm.unitPrice"
          type="number"
          step="0.01"
          class="custom-input"
          placeholder="Ingresar precio (por unidad)"
          autocomplete="off"
        />
      </div>
      <div class="flex mt-4 space-x-4">
        <div class="w-full">
          <label class="custom-label-input" for="unitMeasurement"
            >Unidad de medida</label
          >
          <select
            v-model="createProductForm.unitMeasurement"
            id="unitMeasurement"
            class="custom-select"
          >
            <option value="" selected disabled>Elige una medida</option>
            <option
              v-for="(measurement, key) in unitMeasurements"
              :key="key"
              :value="measurement"
            >
              {{ measurement }}
            </option>
          </select>
        </div>
        <div class="w-full">
          <label class="custom-label-input" for="categoryId">Categoría</label>
          <select
            v-model="createProductForm.categoryId"
            name="categoryId"
            id="categoryId"
            class="custom-select"
          >
            <option value="" selected disabled>Elige una categoría</option>
            <option
              v-for="(category, key) in categories"
              :key="key"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-4">
        <button
          type="button"
          @click="showModal = false"
          class="w-full py-2 mx-auto mt-8 font-semibold text-red-100 transition bg-red-600 rounded-lg hover:brightness-90"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="w-full py-2 mx-auto mt-8 font-semibold text-white transition rounded-lg bg-main-primary hover:brightness-90"
        >
          Crear
        </button>
      </div>
    </form>
    <form
      v-if="modalMode === 'edit'"
      @submit.prevent="updateProduct"
      class="p-4"
    >
      <p class="text-lg font-semibold text-center text-neutral-600">
        Editar producto
      </p>
      <div class="flex flex-col mt-2">
        <label class="custom-label-input" for="name">Nombre</label>
        <input
          id="name"
          v-model="editProductForm.name"
          type="text"
          class="custom-input"
          placeholder="Ingresar nombre"
          autocomplete="off"
        />
      </div>
      <div class="flex flex-col mt-4">
        <label class="custom-label-input" for="unitPrice"
          >Precio (por unidad)</label
        >
        <input
          id="unitPrice"
          v-model="editProductForm.unitPrice"
          type="number"
          step="0.01"
          class="custom-input"
          placeholder="Ingresar precio (por unidad)"
          autocomplete="off"
        />
      </div>
      <div class="flex mt-4 space-x-4">
        <div class="w-full">
          <label class="custom-label-input" for="unitMeasurement"
            >Unidad de medida</label
          >
          <select
            v-model="editProductForm.unitMeasurement"
            id="unitMeasurement"
            class="custom-select"
          >
            <option value="" selected disabled>Elige una medida</option>
            <option
              v-for="(measurement, key) in unitMeasurements"
              :key="key"
              :value="measurement"
            >
              {{ measurement }}
            </option>
          </select>
        </div>
        <div class="w-full">
          <label class="custom-label-input" for="categoryId">Categoría</label>
          <select
            v-model="editProductForm.categoryId"
            name="categoryId"
            id="categoryId"
            class="custom-select"
          >
            <option value="" selected disabled>Elige una categoría</option>
            <option
              v-for="(category, key) in categories"
              :key="key"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-4">
        <button
          type="button"
          @click="showModal = false"
          class="w-full py-2 mx-auto mt-8 font-semibold text-red-100 transition bg-red-600 rounded-lg hover:brightness-90"
        >
          Cancelar
        </button>
        <button
          type="submit"
          class="w-full py-2 mx-auto mt-8 font-semibold text-white transition rounded-lg bg-main-primary hover:brightness-90"
        >
          Actualizar
        </button>
      </div>
    </form>
  </Modal>
  <div class="p-2 bg-white rounded-lg shadow" v-if="mountLoaded">
    <DataTable
      class="text-sm md:text-md"
      :value="products"
      :virtualScrollerOptions="{ itemSize: 20 }"
    >
      <template #header>
        <div class="flex items-center space-x-2">
          <h1 class="text-lg font-black md:text-xl">Listado de productos</h1>
          <div class="flex items-center justify-end flex-1 space-x-2">
            <button
              class="inline-flex items-center px-4 py-2 text-sm transition rounded-lg min-w-max md:text-base bg-main-secondary hover:brightness-90"
              @click="openCreateModal"
            >
              Crear producto
            </button>
          </div>
        </div>
        <div class="space-x-4">
          <button
            class="inline-flex items-center p-2.5 text-sm text-white transition bg-red-700 rounded-lg min-w-max md:text-base hover:brightness-75"
            type="button"
            @click="generatePDFReport"
          >
            <i class="pi pi-file-pdf"></i>
          </button>
          <button
            class="inline-flex items-center p-2.5 text-sm text-white transition bg-green-700 rounded-lg min-w-max md:text-base hover:brightness-75"
            type="button"
            @click="generateExcelReport"
          >
            <i class="pi pi-file-excel"></i>
          </button>
        </div>
        <input
          id="filter"
          :value="filter"
          @input="(e) => (filter = e.target.value)"
          type="text"
          class="w-full mt-4 custom-input"
          placeholder="Buscar productos"
          autocomplete="off"
        />
      </template>
      <Column header="ID" field="id" />
      <Column header="Nombre" field="name" />
      <Column header="Precio Unitario">
        <template #body="{ data }">
          {{ data.unitPrice.toFixed(2) }}
        </template>
      </Column>
      <Column header="Inventario" field="stock" />
      <Column header="Unidad de medida" field="unitMeasurement" />
      <Column header="Categoría" field="category.name" />
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex w-full space-x-6 md:space-x-4">
            <button
              @click="openEditModal(data)"
              class="px-2 py-1.5 text-xs font-semibold text-red-100 transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <i class="h-full pi pi-pencil"></i>
            </button>
            <button
              @click="openDeleteModal(data)"
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