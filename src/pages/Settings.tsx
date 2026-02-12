import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/common/Section';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, Save } from 'lucide-react';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [zoomLink, setZoomLink] = useState(() => {
    return localStorage.getItem('auto-tutor-zoom-link') || '';
  });
  const [problemSiteLink, setProblemSiteLink] = useState(() => {
    return localStorage.getItem('auto-tutor-problem-site-link') || '';
  });

  const handleSave = () => {
    localStorage.setItem('auto-tutor-zoom-link', zoomLink);
    localStorage.setItem('auto-tutor-problem-site-link', problemSiteLink);
    // 간단한 피드백 (실제로는 toast 사용 권장)
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      <Section title="일반 설정">
        <Card>
          <CardHeader>
            <CardTitle>링크 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zoom-link">Zoom 링크</Label>
              <Input
                id="zoom-link"
                type="url"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem-site-link">변형문제 사이트 링크</Label>
              <Input
                id="problem-site-link"
                type="url"
                value={problemSiteLink}
                onChange={(e) => setProblemSiteLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              저장
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="테마 설정">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">다크/라이트 모드</h3>
                <p className="text-sm text-muted-foreground">
                  테마를 전환합니다 (헤더에서도 가능)
                </p>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    다크 모드
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    라이트 모드
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="데이터 저장 정책">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">⚠ 반드시 지킬 것:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>문제 이미지 저장 금지</li>
                <li>정답 저장 금지</li>
                <li>채점 결과(O/X/△)만 저장</li>
                <li>숙제 범위 텍스트만 저장</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
