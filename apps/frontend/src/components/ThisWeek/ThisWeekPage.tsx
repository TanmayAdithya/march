"use client"

import React, { useState } from "react"

import { addWeeks } from "date-fns"

import { CustomKanban } from "./CustomKanban"
import { ThisWeekArrows } from "./ThisWeekArrows"
import { ThisWeekExpandedItem } from "@/src/components/ThisWeek/ThisWeekExpandedItem"
import { Item } from "@/src/lib/@types/Items/Items"
import useItemsStore from "@/src/lib/store/items.store"
import classNames from "@/src/utils/classNames"
import {
  getCurrentWeek,
  getFormattedDateRange,
  getWeeksInMonth,
} from "@/src/utils/datetime"

export const ThisWeekPage: React.FC = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const weekNumber = getCurrentWeek(currentDate)
  const totalWeeks = getWeeksInMonth(currentDate)
  const formattedDateRange = getFormattedDateRange(currentDate)
  const { items, selectedItem } = useItemsStore()

  const doneItems = items.filter((item: Item) => item.status === "done")

  const handleWeekChange = (direction: "left" | "right") => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, direction === "left" ? -1 : 1)
      const newWeekNumber = getCurrentWeek(newDate)
      return newWeekNumber >= 1 && newWeekNumber <= totalWeeks
        ? newDate
        : prevDate
    })
  }

  return (
    <div className="flex size-full">
      <div
        className={classNames(
          "flex flex-col gap-8",
          selectedItem ? "w-1/2" : "w-full lg:w-9/12"
        )}
      >
        <div className="flex items-center gap-8 text-sm">
          <h1 className="text-2xl text-foreground">Week {weekNumber}</h1>
          <div className="flex gap-4">
            <p>
              {doneItems.length}/{items.length} completed
            </p>
            <p>
              {items.length > 0
                ? ((doneItems.length / items.length) * 100).toFixed(0)
                : 0}
              %
            </p>
            <p>{formattedDateRange}</p>
          </div>
          <ThisWeekArrows onChangeWeek={handleWeekChange} />
        </div>
        <CustomKanban />
      </div>
      <ThisWeekExpandedItem />
    </div>
  )
}
