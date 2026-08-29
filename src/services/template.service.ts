/****************************
 TEMPLATE HELPER SERVICE
 ****************************/

export class TemplateService {

    /**
     * Replaces all placeholders in a template string with their values.
     *
     * Works with any string template — email HTML, SMS text, PDF content etc.
     *
     * @param template  The template string containing placeholders
     * @param variables Key-value map of placeholder → replacement value
     *
     * @example
     * TemplateService.compile(forgotPasswordTemplate, {
     *     'user-name':           'Rahul Patel',
     *     'reset-password-link': 'https://...',
     *     'logo-path':           configuration.imageLogoPath
     * });
     */
    static compile(template: string, variables: Record<string, string>): string {
        return Object.entries(variables).reduce(
            (output, [placeholder, value]) => output.replaceAll(placeholder, value),
            template
        );
    }

}
