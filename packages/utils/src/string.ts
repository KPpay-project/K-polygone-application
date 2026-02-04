export function shortenEmail(email: string, maxLength = 25): string {
  if ((email?.length || 0) <= maxLength) return email;

  const [localPart, domain] = email.split('@');
  if (!domain) return email;

  const [domainName, ...domainRest] = domain.split('.');

  const localPartLength = Math.ceil(maxLength * 0.4 - 3);
  const domainNameLength = Math.ceil(maxLength * 0.3 - 3);
  const domainRestLength = Math.ceil(maxLength * 0.3 - 3);

  const shortLocalPart =
    localPart.length > localPartLength ? localPart.slice(0, localPartLength) + '-' : localPart;

  const shortDomainName =
    domainName.length > domainNameLength ? domainName.slice(0, domainNameLength) + '-' : domainName;

  const shortDomainRest =
    domainRest.join('.').length > domainRestLength
      ? domainRest.join('.').slice(0, domainRestLength) + '-'
      : domainRest.join('.');

  return `${shortLocalPart}@${shortDomainName}.${shortDomainRest}`;
}
