<script lang="ts" setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {client} from '../api-client'
import BackButton from '../components/back-button.vue'

const toast = useToast()
const router = useRouter()
const templateName = ref('')
const template = ref('')
const example = ref('')

const createTemplate = async () => {
    const {error} = await client.POST('/create-template', {
        body: {
            name: templateName.value,
            template: template.value,
        },
    })
    if (error) {
        toast.error(`Error creating template\n${error.message}`)
        console.error(error)
    } else {
        toast.success('Template created')
        router.push('/templates')
    }
}

const getPreview = async () => {
    const characters = [
        {name: 'Alice', description: 'A character named Alice.'},
        {name: 'Bob', description: 'A character named Bob.'},
    ]
    const lore = [{name: 'Example', content: 'This would be the text for a lore entry.'}]

    const {data, error} = await client.POST('/parse-template', {
        body: {
            template: template.value,
            characters,
            lore,
        },
    })
    if (error) {
        toast.error(`Error parsing template: ${error.message}`)
    }
    example.value = data?.example || ''
}

const resizeTextarea = async (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight + 4}px`
}
</script>

<template>
    <div class="flex flex-row bg-base-300 p-3">
        <BackButton />
        <h1 class="text-xl ml-5">Create Template</h1>
    </div>

    <div class="flex flex-col bg-base-200 rounded-lg p-3 pt-0 m-2">
        <label class="form-control w-full">
            <div class="label">
                <span class="label-text">Template Name</span>
            </div>
            <input
                type="text"
                v-model="templateName"
                class="input input-bordered mb-auto mr-5 max-w-80 border-2 focus:outline-none focus:border-primary" />
        </label>
        <div class="flex flex-col w-full">
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Template</span>
                </div>
                <textarea
                    v-model="template"
                    @input="resizeTextarea"
                    class="textarea textarea-bordered leading-normal p-2 focus:outline-none focus:border-primary" />
            </label>
        </div>

        <div class="flex flex-row space-x-2 mt-2">
            <button @click="getPreview" class="btn btn-neutral flex-grow">Preview</button>
            <button @click="createTemplate" class="btn btn-primary flex-grow">Create Template</button>
        </div>
    </div>

    <div v-if="example" class="flex w-full bg-base-200 rounded-lg p-3 m-2 whitespace-pre-wrap">
        {{ example }}
    </div>
</template>
