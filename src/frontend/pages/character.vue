<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router'
import {db} from '../db'
import {useDexieLiveQuery} from '../lib/livequery'

const route = useRoute()
const router = useRouter()
const characterId = Number(route.query.id)

const defaultCharacter = {name: '', description: '', image: '../assets/img/placeholder-avatar.webp'}
const character = useDexieLiveQuery(() => db.characters.get(characterId), {initialValue: defaultCharacter})

const updateCharacter = async () => {
    if (!character.value) {
        return
    }
    await db.characters.update(characterId, character.value)
}

const uploadImage = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    if (fileInput) {
        fileInput.click()
    }
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (!(target instanceof HTMLInputElement) || !target.files || target.files.length === 0) {
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        if (e.target === null || e.target.result === null) {
            console.error('FileReader failed to read file')
            return
        }
        character.value.image = e.target.result
        updateCharacter()
    }
    reader.readAsDataURL(target.files[0])
}

const removeImage = () => {
    character.value.image = ''
    updateCharacter()
}

const deleteCharacter = async () => {
    await db.characters.delete(characterId)
    await router.push('/characters')
}
</script>

<template>
    <div class="flex flex-col px-3 pb-3">
        <!-- Character Details -->
        <div class="card bg-base-200 p-5">
            <h2 class="text-xl">Character Info</h2>
            <div class="divider mt-2"></div>

            <input
                type="text"
                v-model="character.name"
                class="input input-bordered mb-auto mr-5 max-w-80 border-2 focus:outline-none focus:border-primary"
                placeholder="Character Name" />

            <textarea
                class="textarea textarea-bordered mt-5 min-h-36 border-2 leading-normal focus:outline-none focus:border-primary"
                v-model="character.description"
                placeholder="Description"></textarea>

            <!-- Avatar -->
            <div class="flex flex-row mt-5">
                <div class="avatar">
                    <div class="w-36 h-36 rounded-xl">
                        <img v-if="character.image" :src="character.image" :alt="character.name + ' avatar'" />
                        <img v-else src="../assets/img/placeholder-avatar.webp" :alt="character.name + ' avatar'" />
                    </div>
                </div>
                <button class="btn btn-primary mt-auto ml-5" @click="uploadImage">Upload</button>
                <button v-if="character.image" class="btn btn-error mt-auto ml-5" @click="removeImage">Delete</button>
                <input type="file" id="fileInput" @change="handleFileUpload" class="hidden" />
            </div>

            <div class="divider"></div>
            <div class="flex flex-row">
                <button class="btn btn-primary" @click="updateCharacter()">Update</button>
                <button class="btn btn-error ml-5" @click="deleteCharacter()">Delete</button>
            </div>
        </div>
    </div>
</template>