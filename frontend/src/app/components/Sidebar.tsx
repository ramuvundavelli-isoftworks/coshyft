import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useRole } from '../context/RoleContext';
import { useSidebar } from '../context/SidebarContext';
import { getNavigationForRole } from '../config/navigation';
import { ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, Menu } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function Sidebar() {
  const { currentUser } = useRole();
  const location = useLocation();
  const navigation = getNavigationForRole(currentUser.role);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { isCollapsed, toggleSidebar } = useSidebar();

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((s) => s !== title)
        : [...prev, title]
    );
  };

  const handleToggleCollapse = () => {
    toggleSidebar();
    // When collapsing, collapse all sections
    if (!isCollapsed) {
      setExpandedSections([]);
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-card overflow-y-auto transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Toggle Button */}
      <div className={cn(
        "flex items-center h-14 border-b px-3",
        isCollapsed ? "justify-center" : "justify-end"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="py-4">
        {navigation.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.title && !isCollapsed && (
              <div className="px-6 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            <nav className={cn("space-y-1", isCollapsed ? "px-2" : "px-3")}>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedSections.includes(item.label);

                if (isCollapsed) {
                  // Collapsed view - show icons only with tooltip
                  return (
                    <TooltipProvider key={item.path}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              'flex items-center justify-center h-10 rounded-lg text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-info-subtle text-info'
                                : 'text-foreground hover:bg-muted'
                            )}
                          >
                            <Icon className={cn('h-5 w-5', isActive ? 'text-info' : 'text-muted-foreground')} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                }

                // Expanded view - show full navigation
                return (
                  <div key={item.path}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleSection(item.label)}
                        className={cn(
                          'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          'text-foreground hover:bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <span>{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={cn(
                          'flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-info-subtle text-info'
                            : 'text-foreground hover:bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={cn('h-5 w-5', isActive ? 'text-info' : 'text-muted-foreground')} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                    {hasChildren && isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children?.map((child) => {
                          const childIsActive = location.pathname === child.path;
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                                childIsActive
                                  ? 'bg-info-subtle text-info'
                                  : 'text-muted-foreground hover:bg-background-subtle'
                              )}
                            >
                              <ChildIcon className="h-4 w-4" />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}