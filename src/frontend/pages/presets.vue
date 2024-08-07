<script lang="ts" setup>
import {ref, computed} from 'vue'
import {useToast} from 'vue-toastification'
import {client} from '../api-client'

const toast = useToast()

const {data, error} = await client.GET('/presets')
if (error) {
    toast.error('Error getting presets')
}

const presets = ref(data?.presets || [])
const selectedPresetId = ref(data?.activePresetId || 0)

const activePreset = computed(() => {
    const missingPreset = {
        id: 0,
        name: '',
        maxTokens: 0,
        context: 0,
        temperature: 0,
        seed: 0,
        minP: 0,
        topP: 0,
        topK: 0,
        tfsz: 0,
        typicalP: 0,
        repeatPenalty: 0,
        repeatLastN: 0,
        penalizeNL: false,
        presencePenalty: 0,
        frequencyPenalty: 0,
        mirostat: 0,
        mirostatTau: 0,
        mirostatEta: 0,
    }
    return presets.value?.find((preset) => preset.id === selectedPresetId.value) || missingPreset
})

const setActivePreset = async () => {
    const {error} = await client.POST('/set-active-preset/{id}', {
        params: {path: {id: String(selectedPresetId.value)}},
    })
    if (error) {
        toast.error('Error setting active preset')
    } else {
        toast.success('Active preset set')
    }
}

const updatePreset = async () => {
    const {error} = await client.POST('/update-preset/{id}', {
        params: {path: {id: String(selectedPresetId.value)}},
        body: {
            name: activePreset.value.name,
            context: activePreset.value.context,
            maxTokens: activePreset.value.maxTokens,
            seed: activePreset.value.seed,
            temperature: activePreset.value.temperature,
            topK: activePreset.value.topK,
            topP: activePreset.value.topP,
            minP: activePreset.value.minP,
            tfsz: activePreset.value.tfsz,
            typicalP: activePreset.value.typicalP,
            repeatPenalty: activePreset.value.repeatPenalty,
            repeatLastN: activePreset.value.repeatLastN,
            penalizeNL: activePreset.value.penalizeNL,
            presencePenalty: activePreset.value.presencePenalty,
            frequencyPenalty: activePreset.value.frequencyPenalty,
            mirostat: activePreset.value.mirostat,
            mirostatTau: activePreset.value.mirostatTau,
            mirostatEta: activePreset.value.mirostatEta,
        },
    })
    if (error) {
        toast.error('Error updating preset')
    } else {
        toast.success('Preset updated')
    }
}

const deletePreset = async () => {
    const {error} = await client.POST('/delete-preset/{id}', {
        params: {path: {id: String(selectedPresetId.value)}},
    })
    if (error) {
        toast.error(`Error deleting preset\n${error.message}`)
    } else {
        toast.success('Preset deleted')
        presets.value.splice(
            presets.value.findIndex((preset) => preset.id === selectedPresetId.value),
            1,
        )
        selectedPresetId.value = 1
    }
}
</script>

<template>
    <div class="py-3 px-2">
        <div class="flex flex-row">
            <div class="flex flex-col">
                <select v-model="selectedPresetId" @change="setActivePreset" class="select select-bordered min-w-60">
                    <option v-for="preset in presets" :key="preset.id" :value="preset.id">
                        {{ preset.name }}
                    </option>
                </select>
            </div>

            <router-link to="/create-preset" class="btn btn-primary mt-auto ml-3">Create Preset</router-link>
        </div>

        <div class="flex flex-col justify-between bg-base-200 rounded-lg p-3 pt-1 mt-3">
            <div class="flex flex-row">
                <div class="flex flex-col flex-grow mr-8">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Preset Name</span>
                        </div>
                        <input
                            type="text"
                            v-model="activePreset.name"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Max Response Tokens</span>
                        </div>
                        <input
                            type="number"
                            class="input input-bordered focus:outline-none focus:border-primary"
                            v-model="activePreset.maxTokens" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Max Context</span>
                        </div>
                        <input
                            type="number"
                            class="input input-bordered focus:outline-none focus:border-primary"
                            v-model="activePreset.context" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Temperature</span>
                        </div>
                        <input
                            type="number"
                            v-model="activePreset.temperature"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Seed</span>
                        </div>
                        <input
                            type="number"
                            v-model="activePreset.seed"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Min P</span>
                        </div>
                        <input
                            type="number"
                            class="input input-bordered focus:outline-none focus:border-primary"
                            v-model="activePreset.minP" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Top P</span>
                        </div>
                        <input
                            type="number"
                            class="input input-bordered focus:outline-none focus:border-primary"
                            v-model="activePreset.topP" />
                    </label>

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Top K</span>
                        </div>
                        <input
                            type="number"
                            class="input input-bordered focus:outline-none focus:border-primary"
                            v-model="activePreset.topK" />
                    </label>
                </div>

                <div class="flex flex-col flex-grow">
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">tfsz</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.tfsz"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Typical-p</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.typicalP"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Repeat-penalty</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.repeatPenalty"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Repeat-last-n</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.repeatLastN"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Penalize-nl</span></div>
                        <select v-model.number="activePreset.penalizeNL" class="select select-bordered">
                            <option :value="true">true</option>
                            <option :value="false">false</option>
                        </select>
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Presence-penalty</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.presencePenalty"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Frequency-penalty</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.frequencyPenalty"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Mirostat</span></div>
                        <select v-model.number="activePreset.mirostat" class="select">
                            <option :value="0">0 (disabled)</option>
                            <option :value="1">1 (Mirostat 1.0)</option>
                            <option :value="2">2 (Mirostat 2.0)</option>
                        </select>
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Mirostat-tau</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.mirostatTau"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                    <label class="form-control w-full">
                        <div class="label"><span class="label-text">Mirostat-eta</span></div>
                        <input
                            type="text"
                            v-model.number="activePreset.mirostatEta"
                            class="input input-bordered focus:outline-none focus:border-primary" />
                    </label>
                </div>
            </div>
            <div class="flex flex-row space-x-2 mt-5">
                <button @click="updatePreset" class="btn btn-primary flex-grow">Save</button>
                <button @click="deletePreset" class="btn btn-error flex-grow">Delete</button>
            </div>
        </div>
    </div>
</template>
