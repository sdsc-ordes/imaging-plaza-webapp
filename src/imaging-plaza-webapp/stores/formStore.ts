import {TypedFetch} from '@coteries/utils/api-utils'
import {getAuth} from 'firebase/auth'
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import {SchemaSoftwareSourceCode} from '../components/Form/schema'

/**
 * Frontend management of the form and the values
 */
export type FormStore = {
  data: Partial<SchemaSoftwareSourceCode>
  load: (repo?: string) => Promise<void>
  fairLevel?: number
  saveDraft: (p: Partial<SchemaSoftwareSourceCode>) => Promise<void>
  validateSoftware: () => Promise<void>
  isSoftwareValidatable: boolean
  // #INSERT_PREFILL_2: duplicate
  loadFromGimie: (githubRepository: string) => Promise<void>
  loadWithoutGimie: (repository: string) => void
  isLoaded: boolean
  isDirty: boolean
  setDirty: () => void
  isDraftDisabled: boolean
  setDraftDisabled: () => void
  /* #INSERT_SOFTWARE_ACTION_2: add method and route to tackle the change (don't forget to refresh the software and redirect the user to some place) */
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      data: {},
      isLoaded: false,
      isSoftwareValidatable: false,
      isDirty: false,
      isDraftDisabled: false,
      setDirty: () => {
        set({isDirty: true})
      },
      load: async repository => {
        // console.log("formStore.ts | useFormStore", repository)
        const currentRepo = get().data
        if (currentRepo['schema:identifier'] !== repository) {
          set({isLoaded: !repository})
          if (repository) {
            const URLParams = new URLSearchParams({repository})
            const data = await TypedFetch.get(`/api/softwares/get?${URLParams.toString()}`, {
              parser: SchemaSoftwareSourceCode,
              headers: {
                'X-Firebase-AppCheck': (await getAuth().currentUser?.getIdToken()) ?? '',
              },
            })
            const result = SchemaSoftwareSourceCode.safeParse(data)
            set({
              data: data as Partial<SchemaSoftwareSourceCode>,
              isLoaded: true,
              isSoftwareValidatable: result.success,
              isDirty: false,
            })
          }
        } else {
          const result = SchemaSoftwareSourceCode.safeParse(currentRepo)
          set({
            isLoaded: true,
            isSoftwareValidatable: result.success,
            isDirty: false,
          })
        }
      },
      loadFromGimie: async repository => {
        // Log the data obtained from Gimie
        // console.log('formStore.ts - loadFromGimie - repository', repository);

        
        const d = await TypedFetch.post(
          '/api/gimie',
          {repository},
          {
            parser: SchemaSoftwareSourceCode.partial(),
            headers: {
              'X-Firebase-AppCheck': await getAuth().currentUser!.getIdToken(),
            },
          }
        )
        // Log the data obtained from Gimie
        // console.log('formStore.ts - loadFromGimie - d', d);

        set(({data}) => ({
          data: {
            'schema:identifier': repository,
            ...(d as Partial<SchemaSoftwareSourceCode>),
          },
        }))

        
      },
      loadWithoutGimie: repo => {
        set(() => ({
          data: {
            'schema:identifier': repo,
            'schema:codeRepository': [repo],
          },
        }))
      },
      saveDraft: async p => {
        console.debug('formStore.ts - saveDraft - p: ', p)
        const data = await TypedFetch.post(
          '/api/softwares/save-draft',
          {...get().data, ...p},
          {
            parser: SchemaSoftwareSourceCode.partial(),
            headers: {
              'X-Firebase-AppCheck': await getAuth().currentUser!.getIdToken(),
            },
          }
        )
        set({
          data: data as Partial<SchemaSoftwareSourceCode>,
          isDirty: false,
          isSoftwareValidatable: true,
        })
      },
      setDraftDisabled: () => {
        set({isDraftDisabled: true})
      },
      validateSoftware: async () => {
        if (!get().isDirty) {
          try {
            set({isDraftDisabled: true})

            const data = await TypedFetch.post(
              '/api/softwares/validate',
              get().data as SchemaSoftwareSourceCode,
              {
                parser: SchemaSoftwareSourceCode,
                headers: {
                  'X-Firebase-AppCheck': await getAuth().currentUser!.getIdToken(),
                },
              }
            )
            // console.log('formStore.ts - saveDraft - p: ', p)
            set({data: data as SchemaSoftwareSourceCode})
          } catch (e) {
          } finally {
            set({isDraftDisabled: false})
          }
        }
      },
    }),
    {
      name: 'imagingplaza-formstore',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
