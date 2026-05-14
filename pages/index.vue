<template>
  <div class="container">
    <!-- Page Hero -->
    <section class="page-hero">
      <h1 class="hero-title">
        <span class="gradient-text">Spocik</span>
        <span class="hero-subtitle">Serwis Informacyjny Białegostoku</span>
      </h1>
    </section>

    <!-- Toolbar -->
    <section class="toolbar glass">
      <div class="toolbar-left">
        <!-- View Toggle -->
        <div class="view-toggle">
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'day' }"
            @click="viewMode = 'day'"
          >
            📅 Dzień
          </button>
          <button
            class="toggle-btn"
            :class="{ active: viewMode === 'week' }"
            @click="viewMode = 'week'"
          >
            🗓️ Tydzień
          </button>
        </div>

        <!-- Date / Week Selector -->
        <div v-if="viewMode === 'day'" class="selector">
          <input
            v-model="selectedDate"
            type="date"
            class="form-input selector-input"
            @change="loadEvents"
          />
        </div>
        <div v-else class="selector week-selector">
          <div class="form-group" style="gap:4px;">
            <label class="form-label">Tydzień</label>
            <input
              v-model.number="selectedWeek"
              type="number"
              min="1"
              max="53"
              class="form-input selector-input"
              @change="loadEvents"
            />
          </div>
          <div class="form-group" style="gap:4px;">
            <label class="form-label">Rok</label>
            <input
              v-model.number="selectedYear"
              type="number"
              min="2020"
              max="2030"
              class="form-input selector-input"
              @change="loadEvents"
            />
          </div>
        </div>
      </div>

      <div class="toolbar-right">
        <button class="btn btn-secondary btn-sm" @click="handleDownloadReport" :disabled="downloadingReport">
          <span v-if="downloadingReport" class="spinner" style="width:14px;height:14px;border-width:2px;"></span>
          📄 Raport PDF
        </button>
        <button v-if="isLoggedIn" class="btn btn-primary" @click="openCreateModal">
          ＋ Dodaj wydarzenie
        </button>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="events-section">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Ładowanie wydarzeń...</p>
      </div>

      <div v-else-if="events.length === 0" class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <p class="empty-state-title">Brak wydarzeń</p>
        <p class="empty-state-desc">
          Nie znaleziono wydarzeń dla wybranego okresu. Zmień datę lub dodaj nowe wydarzenie.
        </p>
      </div>

      <div v-else class="events-grid">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          @select="openDetailModal"
          @edit="openEditModal"
          @delete="confirmDelete"
        />
      </div>
    </section>

    <!-- Detail Modal -->
    <EventDetailModal
      :event="selectedEvent"
      @close="selectedEvent = null"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <!-- Create / Edit Modal -->
    <Teleport to="body">
      <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingEvent ? 'Edytuj wydarzenie' : 'Nowe wydarzenie' }}</h2>
            <button class="btn btn-ghost btn-sm" @click="closeFormModal">✕</button>
          </div>
          <div class="modal-body">
            <EventForm
              :edit-event="editingEvent"
              @submit="handleFormSubmit"
              @cancel="closeFormModal"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div v-if="deletingEvent" class="modal-overlay" @click.self="deletingEvent = null">
        <div class="modal-content" style="max-width:420px;">
          <div class="modal-header">
            <h2>Potwierdź usunięcie</h2>
            <button class="btn btn-ghost btn-sm" @click="deletingEvent = null">✕</button>
          </div>
          <div class="modal-body">
            <p style="color:var(--text-secondary);">
              Czy na pewno chcesz usunąć wydarzenie
              <strong style="color:var(--text-primary);">„{{ deletingEvent.name }}"</strong>?
              Tej operacji nie można cofnąć.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" @click="deletingEvent = null">Anuluj</button>
            <button class="btn btn-danger btn-sm" @click="handleDelete">🗑️ Usuń</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { EventItem, EventCreate, EventUpdate } from '~/types'

definePageMeta({ layout: 'default' })

const { isLoggedIn } = useAuth()
const { fetchEventsByDate, fetchEventsByWeek, createEvent, updateEvent, deleteEvent, downloadReport } = useEvents()
const toast = useToast()

// ── State ──
const viewMode = ref<'day' | 'week'>('day')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedWeek = ref(getISOWeek(new Date()))
const selectedYear = ref(new Date().getFullYear())

const events = ref<EventItem[]>([])
const loading = ref(false)
const downloadingReport = ref(false)

const selectedEvent = ref<EventItem | null>(null)
const showFormModal = ref(false)
const editingEvent = ref<EventItem | null>(null)
const deletingEvent = ref<EventItem | null>(null)

// ── Helpers ──
function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// ── Data Loading ──
async function loadEvents() {
  loading.value = true
  try {
    if (viewMode.value === 'day') {
      events.value = await fetchEventsByDate(selectedDate.value)
    } else {
      events.value = await fetchEventsByWeek(selectedWeek.value, selectedYear.value)
    }
  } catch (err: any) {
    toast.error('Nie udało się pobrać wydarzeń')
    events.value = []
  } finally {
    loading.value = false
  }
}

// Watch view mode changes
watch(viewMode, () => loadEvents())

// ── Event Details ──
async function openDetailModal(event: EventItem) {
  // Fetch fresh data with HATEOAS links
  try {
    const { fetchEvent } = useEvents()
    const full = await fetchEvent(event.id)
    selectedEvent.value = full
  } catch {
    selectedEvent.value = event
  }
}

// ── Create / Edit ──
function openCreateModal() {
  editingEvent.value = null
  showFormModal.value = true
}

function openEditModal(event: EventItem) {
  selectedEvent.value = null
  editingEvent.value = event
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  editingEvent.value = null
}

async function handleFormSubmit(data: EventCreate | EventUpdate) {
  try {
    if (editingEvent.value) {
      await updateEvent(editingEvent.value.id, data as EventUpdate)
      toast.success('Wydarzenie zaktualizowane!')
    } else {
      await createEvent(data as EventCreate)
      toast.success('Wydarzenie dodane!')
    }
    closeFormModal()
    await loadEvents()
  } catch (err: any) {
    const detail = err?.data?.error || err?.message || 'Operacja nie powiodła się'
    toast.error(detail)
  }
}

// ── Delete ──
function confirmDelete(event: EventItem) {
  selectedEvent.value = null
  deletingEvent.value = event
}

async function handleDelete() {
  if (!deletingEvent.value) return
  try {
    await deleteEvent(deletingEvent.value.id)
    toast.success('Wydarzenie usunięte!')
    deletingEvent.value = null
    await loadEvents()
  } catch (err: any) {
    const detail = err?.data?.error || err?.message || 'Nie udało się usunąć wydarzenia'
    toast.error(detail)
  }
}

// ── PDF Report ──
async function handleDownloadReport() {
  downloadingReport.value = true
  try {
    await downloadReport()
    toast.success('Raport PDF pobrany!')
  } catch {
    toast.error('Nie udało się pobrać raportu')
  } finally {
    downloadingReport.value = false
  }
}

// ── Initial Load ──
onMounted(() => loadEvents())
</script>

<style scoped>
.page-hero {
  text-align: center;
  padding: 16px 0 32px;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-title .gradient-text {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-muted);
}

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 32px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  display: flex;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border-glass);
}

.toggle-btn {
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.toggle-btn.active {
  background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
  color: white;
}

.toggle-btn:hover:not(.active) {
  background: var(--bg-card-hover);
}

.selector {
  display: flex;
  gap: 12px;
}

.selector-input {
  width: auto;
  min-width: 140px;
}

.week-selector {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.week-selector .form-group {
  flex-direction: column;
}

.week-selector .selector-input {
  min-width: 90px;
}

/* ── Events Grid ── */
.events-section {
  min-height: 300px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: var(--text-muted);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .hero-title .gradient-text {
    font-size: 1.75rem;
  }
}
</style>
