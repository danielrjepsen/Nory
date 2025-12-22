'use client';

import { useTranslation } from 'react-i18next';
import type { StorageSettings } from '../../_types';

interface StorageStepProps {
  data: StorageSettings;
  onChange: (data: StorageSettings) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function StorageStep({ data, onChange, onSubmit, onBack, isSubmitting, error }: StorageStepProps) {
  const { t } = useTranslation('wizard');

  const handleTypeChange = (type: 'local' | 's3') => {
    onChange({ ...data, type });
  };

  const handleChange = (field: keyof StorageSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  const isS3Valid =
    data.type === 's3'
      ? data.s3Bucket?.trim() &&
        data.s3Region?.trim() &&
        data.s3AccessKey?.trim() &&
        data.s3SecretKey?.trim()
      : true;

  const isValid = data.type === 'local' || isS3Valid;

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-nory-yellow border-2 border-nory-black rounded-xl flex items-center justify-center shadow-brutal-sm">
          <span className="text-2xl">💾</span>
        </div>
        <h2 className="text-xl font-bold text-nory-black mb-2">
          {t('steps.storage.title')}
        </h2>
        <p className="text-nory-black/60 text-sm">
          {t('steps.storage.description')}
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('local')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.type === 'local'
                ? 'border-nory-black bg-nory-yellow shadow-brutal-sm'
                : 'border-nory-black/30 hover:border-nory-black bg-nory-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg border-2 border-nory-black flex items-center justify-center ${
                data.type === 'local' ? 'bg-nory-black text-nory-white' : 'bg-nory-gray text-nory-black'
              }`}>
                <span className="text-lg">📁</span>
              </div>
              <span className="font-bold text-nory-black">
                {t('steps.storage.types.local.title')}
              </span>
            </div>
            <p className="text-xs text-nory-black/60">
              {t('steps.storage.types.local.description')}
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('s3')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              data.type === 's3'
                ? 'border-nory-black bg-nory-yellow shadow-brutal-sm'
                : 'border-nory-black/30 hover:border-nory-black bg-nory-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg border-2 border-nory-black flex items-center justify-center ${
                data.type === 's3' ? 'bg-nory-black text-nory-white' : 'bg-nory-gray text-nory-black'
              }`}>
                <span className="text-lg">☁️</span>
              </div>
              <span className="font-bold text-nory-black">
                {t('steps.storage.types.s3.title')}
              </span>
            </div>
            <p className="text-xs text-nory-black/60">
              {t('steps.storage.types.s3.description')}
            </p>
          </button>
        </div>

        {data.type === 'local' && (
          <div className="bg-nory-gray border-2 border-nory-black rounded-xl p-4">
            <label className="block text-sm font-bold text-nory-black mb-2">
              {t('steps.storage.fields.localPath.label')}
            </label>
            <input
              type="text"
              placeholder={t('steps.storage.fields.localPath.placeholder')}
              value={data.localPath || './uploads'}
              onChange={handleChange('localPath')}
              className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
            />
            <p className="text-xs text-nory-black/50 mt-2">
              {t('steps.storage.fields.localPath.help')}
            </p>
          </div>
        )}

        {data.type === 's3' && (
          <div className="bg-nory-gray border-2 border-nory-black rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-nory-black mb-2">
                {t('steps.storage.fields.s3Bucket.label')}
              </label>
              <input
                type="text"
                placeholder={t('steps.storage.fields.s3Bucket.placeholder')}
                value={data.s3Bucket || ''}
                onChange={handleChange('s3Bucket')}
                className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-nory-black mb-2">
                {t('steps.storage.fields.s3Region.label')}
              </label>
              <input
                type="text"
                placeholder={t('steps.storage.fields.s3Region.placeholder')}
                value={data.s3Region || ''}
                onChange={handleChange('s3Region')}
                className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-nory-black mb-2">
                {t('steps.storage.fields.s3AccessKey.label')}
              </label>
              <input
                type="text"
                placeholder={t('steps.storage.fields.s3AccessKey.placeholder')}
                value={data.s3AccessKey || ''}
                onChange={handleChange('s3AccessKey')}
                className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-nory-black mb-2">
                {t('steps.storage.fields.s3SecretKey.label')}
              </label>
              <input
                type="password"
                placeholder={t('steps.storage.fields.s3SecretKey.placeholder')}
                value={data.s3SecretKey || ''}
                onChange={handleChange('s3SecretKey')}
                className="w-full px-4 py-3 bg-nory-white border-2 border-nory-black rounded-xl text-nory-black placeholder:text-nory-black/40 focus:outline-none focus:ring-2 focus:ring-nory-yellow"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8 max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-nory-gray hover:bg-nory-gray/80 disabled:opacity-50 text-nory-black font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all"
        >
          {t('buttons.back')}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="flex-1 bg-nory-black hover:bg-nory-black/90 disabled:bg-nory-black/30 disabled:cursor-not-allowed text-nory-white font-bold py-3 px-6 rounded-xl border-2 border-nory-black transition-all hover:shadow-brutal-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-nory-white/30 border-t-nory-white rounded-full animate-spin" />
          )}
          {isSubmitting ? t('buttons.completing') : t('buttons.next')}
        </button>
      </div>
    </div>
  );
}
