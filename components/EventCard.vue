<template>
  <article class="event-card glass-card" @click="$emit('select', event)">
    <div class="card-top">
      <span class="badge" :class="typeBadgeClass">{{ event.type }}</span>
      <span class="card-date">{{ formattedDate }}</span>
    </div>

    <h3 class="card-title">{{ event.name }}</h3>

    <p v-if="event.description" class="card-desc">{{ truncatedDesc }}</p>

    <div class="card-footer">
      <span class="card-author">👤 {{ event.author.username }}</span>

      <div v-if="canEdit" class="card-actions" @click.stop>
        <button class="btn btn-ghost btn-sm" @click="$emit('edit', event)" title="Edytuj">
          ✏️
        </button>
        <button class="btn btn-ghost btn-sm" @click="$emit('delete', event)" title="Usuń">
          🗑️
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { EventItem } from '~/types'

const props = defineProps<{
  event: EventItem
}>()

defineEmits<{
  select: [event: EventItem]
  edit: [event: EventItem]
  delete: [event: EventItem]
}>()

const { user, isAdmin } = useAuth()

const canEdit = computed(() => {
  if (!user.value) return false
  if (isAdmin.value) return true
  return user.value.id === props.event.author.id
})

const formattedDate = computed(() => {
  const d = new Date(props.event.date)
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })
})

const truncatedDesc = computed(() => {
  if (!props.event.description) return ''
  return props.event.description.length > 120
    ? props.event.description.substring(0, 120) + '…'
    : props.event.description
})

const typeColors: Record<string, string> = {
  'Koncert': 'badge-violet',
  'Sport': 'badge-success',
  'Kultura': 'badge-indigo',
  'Edukacja': 'badge-warning',
}

const typeBadgeClass = computed(() => {
  return typeColors[props.event.type] || 'badge-indigo'
})
</script>

<style scoped>
.event-card {
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-date {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.3;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.card-author {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.card-actions {
  display: flex;
  gap: 4px;
}
</style>
