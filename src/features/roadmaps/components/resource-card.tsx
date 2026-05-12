import { ExternalLink, PlaySquare, FileText, BookOpen, FileCode } from "lucide-react";
import { Resource } from "@/types/roadmap";

const TypeIcons = {
  video: PlaySquare,
  article: FileText,
  book: BookOpen,
  documentation: FileCode
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = TypeIcons[resource.type] || ExternalLink;

  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className="mt-1 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{resource.author}</span>
          {resource.duration && (
            <>
              <span>•</span>
              <span>{resource.duration}</span>
            </>
          )}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
