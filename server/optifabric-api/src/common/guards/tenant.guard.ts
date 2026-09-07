// Rejects any request whose route/body/query factoryId does not match the
// authenticated user's own JWT-bound factoryId — tenant scoping is never taken
// from client input alone.
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { AuthenticatedUser } from "../../modules/auth/auth.types";

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    if (!user) {
      throw new ForbiddenException("Authentication required.");
    }

    const candidateFactoryId =
      (request.params && request.params.factoryId) ||
      (request.body && (request.body as Record<string, unknown>).factoryId) ||
      (request.query && (request.query as Record<string, unknown>).factoryId);

    if (candidateFactoryId && candidateFactoryId !== user.factoryId) {
      throw new ForbiddenException("Cross-tenant access is not permitted.");
    }
    return true;
  }
}
