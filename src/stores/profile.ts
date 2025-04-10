import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

export interface ProfileData {
    firstName: string
    lastName: string
    username: string
    forehand: string
    height: number | string
    weight: number | string
    age?: number | string
}

export const useProfileStore = defineStore('profile', () => {
    const userStore = useUserStore()

    const profileData = ref<ProfileData>({
        firstName: '',
        lastName: '',
        username: '',
        forehand: '',
        height: '',
        weight: '',
        age: '',
    })

    const isLoading = ref(false)
    const isSubmitting = ref(false)

    // Initialize profile data from current user
    const initProfileData = async () => {
        isLoading.value = true

        try {
            const currentUser = userStore.currentUser

            if (currentUser) {
                profileData.value = {
                    firstName: currentUser.firstName || '',
                    lastName: currentUser.lastName || '',
                    username: currentUser.username || '',
                    forehand: currentUser.forehand || '',
                    height: currentUser.height || '',
                    weight: currentUser.weight || '',
                    age: currentUser.age || '',
                }
            }
        } catch (error) {
            console.error('Error initializing profile data:', error)
        } finally {
            isLoading.value = false
        }
    }

    // Update a single field in profile data
    const updateProfileField = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
        profileData.value[key] = value
    }

    // Submit profile data
    const submitProfile = async () => {
        isSubmitting.value = true

        try {
            // Prepare update data - convert string numbers to actual numbers
            const updateData = {
                ...profileData.value,
                height: profileData.value.height ? Number(profileData.value.height) : undefined,
                weight: profileData.value.weight ? Number(profileData.value.weight) : undefined,
                age: profileData.value.age ? Number(profileData.value.age) : undefined,
            }

            // Submit to API
            await userStore.updateUserProfile(updateData)

            return true
        } catch (error) {
            console.error('Error updating profile:', error)
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        profileData,
        isLoading,
        isSubmitting,
        initProfileData,
        updateProfileField,
        submitProfile,
    }
})
