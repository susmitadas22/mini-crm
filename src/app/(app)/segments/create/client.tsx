'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Card } from '~/components/ui/card'
import { Trash2, Plus } from 'lucide-react'
import { createSegmentSchema, CreateSegmentSchema } from '~/schemas'


const fields = ['total_spend', 'order_count', 'last_order_date']
const operators = ['greater_than', 'less_than', 'equal_to']

export function RuleBuilderForm() {
    const form = useForm<CreateSegmentSchema>({
        resolver: zodResolver(createSegmentSchema),
        defaultValues: {
            segmentName: '',
            rules: [{ field: '', operator: '', value: '' }],
        },
    })

    const { control, register, handleSubmit } = form
    const { fields: ruleFields, append, remove } = useFieldArray({
        control,
        name: 'rules',
    })

    const onSubmit = (data: CreateSegmentSchema) => {
        console.log('Submitted Rules:', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 max-w-3xl w-full mx-auto">
            <h2 className="text-xl font-bold">Segment Rule Builder</h2>

            <Input placeholder="Segment Name" {...register('segmentName')} />

            <div className="space-y-4">
                {ruleFields.map((field, index) => (
                    <Card key={field.id} className="flex items-center p-4">
                        <Select {...register(`rules.${index}.field` as const)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Field" />
                            </SelectTrigger>
                            <SelectContent>
                                {fields.map(f => (
                                    <SelectItem key={f} value={f}>{f.replaceAll('_', ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select {...register(`rules.${index}.operator` as const)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                                {operators.map(o => (
                                    <SelectItem key={o} value={o}>{o.replaceAll('_', ' ')}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input placeholder="Value" {...register(`rules.${index}.value` as const)} />

                        <Button type="button" variant="ghost" onClick={() => remove(index)} className='w-full'>
                            <span>Remove Rule</span>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </Card>
                ))}

                <Button type="button" variant="secondary" onClick={() => append({ field: '', operator: '', value: '' })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Rule
                </Button>
            </div>

            <Button type="submit">Save Segment</Button>
        </form>
    )
}