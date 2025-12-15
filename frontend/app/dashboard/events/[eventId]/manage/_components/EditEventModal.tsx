'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateEvent } from '../../../../_services/events';
import { type EventData } from '../../../../_types/events';
import { Button } from '../../../../_components/Button';
import { Input, Textarea } from '../../../../_components/ui/Input';
import { Alert } from '../../../../_components/Alert';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
  onEventUpdated: (event: EventData) => void;
}

export function EditEventModal({ isOpen, onClose, event, onEventUpdated }: EditEventModalProps) {
  const { t } = useTranslation(['dashboard', 'common']);
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(event.name);
      setDescription(event.description || '');
      setError('');
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t('events.editEvent.errors.nameRequired'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updatedEvent = await updateEvent(event.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      onEventUpdated(updatedEvent);
      onClose();
    } catch (err: any) {
      setError(err?.message || t('events.editEvent.errors.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {t('events.editEvent.title')}
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('events.editEvent.fields.name')} *
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('events.editEvent.placeholders.name')}
              error={!!error && !name.trim()}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {t('events.editEvent.fields.description')}
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={t('events.editEvent.placeholders.description')}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {t('events.editEvent.saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
