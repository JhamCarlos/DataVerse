<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="text-gray-500 text-sm font-medium">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-2">{{ formattedValue }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div class="p-3 rounded-lg" :style="{ backgroundColor: iconBgColor }">
        <i :class="icon" class="text-white text-xl"></i>
      </div>
    </div>
    
    <div v-if="trend" class="flex items-center gap-1 text-sm" :class="trend > 0 ? 'text-green-600' : 'text-red-600'">
      <i :class="trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" class="text-xs"></i>
      <span>{{ Math.abs(trend) }}% vs mes anterior</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  value: [Number, String],
  icon: String,
  iconBgColor: {
    type: String,
    default: '#3B82F6'
  },
  subtitle: String,
  trend: Number,
  format: {
    type: String,
    default: 'text' // 'text', 'currency', 'percentage'
  }
});

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(props.value);
  } else if (props.format === 'percentage') {
    return `${props.value}%`;
  }
  return props.value;
});
</script>
