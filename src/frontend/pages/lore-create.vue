<script lang="ts" setup>
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {loreCollection} from '@/db'
import TopBar from '@/components/top-bar.vue'

type Entry = {name: string; content: string}
type Lore = {name: string; entries: Entry[]}
const lore = reactive<Lore>({
    name: '',
    entries: [],
})
const router = useRouter()
const toast = useToast()

const addEntry = () => {
    lore.entries.push({name: '', content: ''})
}

const createLore = async () => {
    // Remove any entries that have empty content
    lore.entries = lore.entries.filter((entry) => entry.content.trim() !== '')

    await loreCollection.put({
        name: lore.name,
        entries: lore.entries,
    })
    toast.success('Lore created')
    router.push({name: 'lore'})
}
</script>

<template>
    <TopBar title="Create Lorebook" back />

    <div class="flex flex-col bg-base-200 rounded-lg p-3 m-2">
        <input type="text" v-model="lore.name" class="input input-bordered" placeholder="Lore Name" />
        <div class="flex flex-col">
            <div v-for="(entry, index) in lore.entries" :key="index" class="flex flex-col">
                <div class="divider"></div>
                <input type="text" v-model="entry.name" class="input input-bordered mt-2" placeholder="Entry Name" />
                <textarea
                    v-model="entry.content"
                    class="textarea textarea-bordered mt-2"
                    placeholder="Entry Content"></textarea>
            </div>
        </div>
        <div class="flex flex-row mt-3">
            <button @click="addEntry" class="btn btn-sm btn-primary">Add Entry</button>
            <button @click="createLore" class="btn btn-sm btn-primary ml-3">Save</button>
        </div>
    </div>
</template>
