import { camelCase, snakeCase } from 'lodash';
import {
  Resource,
  AbstractInstanceType,
  Method,
  SimpleRecord,
} from 'rest-hooks';

function deeplyApplyKeyTransform(obj: any, transform: (key: string) => string) {
  const ret: any = Array.isArray(obj) ? [] : {};
  Object.keys(obj).forEach(key => {
    if (obj[key] != null && typeof obj[key] === 'object') {
      ret[transform(key)] = deeplyApplyKeyTransform(obj[key], transform);
    } else {
      ret[transform(key)] = obj[key];
    }
  });
  return ret;
}

/** Impelements the common functionality for all Resources we'll make */
export default abstract class BaseResource extends Resource {
  static fromJS<T extends typeof SimpleRecord>(
    this: T,
    props: Partial<AbstractInstanceType<T>>,
  ): Readonly<AbstractInstanceType<T>> {
    delete (props as any).url;
    return super.fromJS(props) as any;
  }

  static async fetch(
    method: Method,
    url: string,
    body?: Readonly<object | string>,
  ) {
    // we'll need to do the inverse operation when sending data back to the server
    if (body) {
      body = deeplyApplyKeyTransform(body, snakeCase);
    }
    // perform actual network request getting back json
    const jsonResponse = await super.fetch(method, url, body);
    // do the conversion!
    return deeplyApplyKeyTransform(jsonResponse, camelCase);
  }

  /** Shape to get a list of entities */
  static listShape<T extends typeof Resource>(this: T) {
    const fetch = async (
      params: Readonly<Record<string, string | number>>,
    ): Promise<any> => {
      const response = await this.fetchResponse('get', this.listUrl(params));
      return {
        link: response.headers.get('link'),
        results: deeplyApplyKeyTransform(
          await response.json().catch((error: any) => {
            error.status = 400;
            throw error;
          }),
          camelCase,
        ),
      };
    };
    return {
      ...super.listShape(),
      fetch,
      schema: { results: [this.asSchema()], link: '' },
    };
  }
}
