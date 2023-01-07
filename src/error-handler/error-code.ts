export class ErrorCode {
  public static readonly Unauthenticated = 'Account doesnt exist';

  public static readonly Authorized = 'You are not authorized';

  public static readonly Blocked = 'Account is blocked';

  public static readonly DuplicateEmailError = 'Email allready taken';

  public static readonly DuplicateUserNameError = 'Name allready taken';

  public static readonly DuplicateCollectionTitleError =
    'Collection.ts title already taken';

  public static readonly OwnerNotFound = 'Owner not found';

  public static readonly NotAllowed = 'You are not allowed to access this resource';

  public static readonly NotFound = 'NotFound';

  public static readonly MaximumAllowedGrade = 'MaximumAllowedGrade';

  public static readonly AsyncError = 'AsyncError';

  public static readonly UnknownError = 'UnknownError';
}
