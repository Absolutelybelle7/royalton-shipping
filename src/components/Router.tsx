import { useState, useEffect, ReactNode, Children, isValidElement } from 'react';

interface RouteProps {
  path: string;
  component: ReactNode;
}

export function Route() {
  return null;
}

export function Router({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Find matching route
  let matchedComponent: ReactNode = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Route) {
      const { path, component } = child.props as RouteProps;
      if (path === currentPath) {
        matchedComponent = component;
      }
    }
  });

  // If no match found, try to find home route as fallback
  if (!matchedComponent) {
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === Route) {
        const { path, component } = child.props as RouteProps;
        if (path === '/') {
          matchedComponent = component;
        }
      }
    });
  }

  if (matchedComponent) {
    return <>{matchedComponent}</>;
  }

  return <div>404 - Page Not Found</div>;
}

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function Link({ to, children, className, onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
    onClick?.();
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
