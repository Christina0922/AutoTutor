import { useNavigate } from 'react-router-dom';
import { Student } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRewardsStore } from '@/store/rewards';
import { StampCounter } from './StampCounter';
import { cn } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const navigate = useNavigate();
  const { getPenaltyCount } = useRewardsStore();
  
  const wrongAnswers = student.logs.filter((log) => log.status === 'X').length;
  const partialAnswers = student.logs.filter((log) => log.status === '△').length;
  const incompleteHomework = student.homework.filter((h) => !h.completed).length;
  const penaltyCount = getPenaltyCount(student.id);
  const hasPenalty = penaltyCount > 0;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent",
        "h-full"
      )}
      onClick={() => navigate(`/student/${student.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{student.name}</h3>
          {hasPenalty && (
            <Badge variant="destructive" className="text-xs">
              경고
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">오답(X): </span>
            <span className="font-semibold text-danger">{wrongAnswers}개</span>
          </div>
          <div>
            <span className="text-muted-foreground">△: </span>
            <span className="font-semibold text-warning">{partialAnswers}개</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">미완료 숙제: </span>
            <span className="font-semibold text-warning">{incompleteHomework}개</span>
          </div>
          <StampCounter stamps={student.stamps} />
        </div>
      </CardContent>
    </Card>
  );
}

