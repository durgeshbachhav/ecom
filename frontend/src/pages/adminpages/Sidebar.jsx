import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SidebarContext = createContext()

function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-background border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/280.svg"
            className={cn("overflow-hidden transition-all", expanded ? "w-12" : "w-0")}
            alt=""
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded((curr) => !curr)}
            className="rounded-lg"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <Avatar>
            <AvatarImage src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "flex justify-between items-center overflow-hidden transition-all",
              expanded ? "w-52 ml-3" : "w-0"
            )}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-muted-foreground">johndoe@gmail.com</span>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar;

export function SidebarItem({ icon, text, active, alert, to }) {
  const { expanded } = useContext(SidebarContext)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={`/${to}`}
            className={cn(
              "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group",
              active
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {icon}
            <span
              className={cn("overflow-hidden transition-all", expanded ? "w-52 ml-3" : "w-0")}
            >
              {text}
            </span>
            {alert && (
              <div
                className={cn(
                  "absolute right-2 w-2 h-2 rounded bg-primary",
                  expanded ? "" : "top-2"
                )}
              />
            )}
          </Link>
        </TooltipTrigger>
        {!expanded && (
          <TooltipContent side="right">
            {text}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}