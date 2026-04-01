/**
 * Turbopack / webpack 공통 require.context 타입 선언
 * webpack-env 패키지 없이 require.context를 타입 안전하게 사용하기 위한 전역 선언
 */
interface RequireContext {
  keys(): string[];
  (id: string): any;
  resolve(id: string): string;
  id: string;
}

interface NodeRequire {
  context(
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp
  ): RequireContext;
}
